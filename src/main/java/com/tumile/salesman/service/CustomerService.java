package com.tumile.salesman.service;

import com.tumile.salesman.api.error.NotFoundException;
import com.tumile.salesman.domain.City;
import com.tumile.salesman.domain.Customer;
import com.tumile.salesman.domain.Player;
import com.tumile.salesman.repository.CityRepository;
import com.tumile.salesman.repository.CustomerRepository;
import com.tumile.salesman.repository.PlayerRepository;
import com.tumile.salesman.service.dto.response.CustomerRes;
import com.tumile.salesman.service.job.AddCustomerJob;
import com.tumile.salesman.service.job.ExpireCustomerJob;
import org.quartz.*;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.tumile.salesman.service.Constants.*;

@Service
public class CustomerService {

    private final CityRepository cityRepository;
    private final CustomerRepository customerRepository;
    private final PlayerRepository playerRepository;
    private final Scheduler scheduler;
    private final Random random = new Random();

    public CustomerService(CustomerRepository customerRepository, CityRepository cityRepository,
                           PlayerRepository playerRepository, Scheduler scheduler) {
        this.customerRepository = customerRepository;
        this.cityRepository = cityRepository;
        this.playerRepository = playerRepository;
        this.scheduler = scheduler;
    }

    public List<CustomerRes> getCustomers(Long playerId) {
        if (playerRepository.findById(playerId).isEmpty()) {
            throw new NotFoundException("Player not found");
        }
        return customerRepository.findAllByPlayerId(playerId).stream()
            .map(CustomerRes::fromCustomer)
            .collect(Collectors.toList());
    }

    public void expireCustomer(Long playerId, Long customerId) {
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new NotFoundException("Customer not found"));
        if (!customer.getPlayer().getId().equals(playerId)) {
            throw new IllegalArgumentException("Not your customer!");
        }
        customer.setExpireAt(null);
        customer.setIsExpired(true);
        customerRepository.save(customer);
    }

    @Transactional
    public void addCustomer(Long playerId, boolean scheduleAdd) throws SchedulerException {
        List<Customer> customers = customerRepository.findAllByPlayerId(playerId);
        if (customers.size() >= 3) {
            return;
        }
        Player player = playerRepository.findById(playerId).orElse(null);
        if (player == null) {
            return;
        }
        List<Long> cityIds = customers.stream().map(Customer::getId).collect(Collectors.toList());
        if (cityIds.isEmpty()) {
            cityIds.add(-1L);
        }
        List<City> availableCities = cityRepository.findAllByIdNotIn(cityIds);
        City city = availableCities.get(random.nextInt(availableCities.size()));
        Date expiredAt = Date.from(Instant.now().plusSeconds(3600L + random.nextInt(7200)));
        Customer customer = new Customer();
        boolean isMale = random.nextBoolean();
        if (isMale) {
            customer.setName(MaleFirstNames.get(random.nextInt(MaleFirstNames.size())) + " " +
                LastNames.get(random.nextInt(LastNames.size())));
            customer.setImage("male-" + random.nextInt(7));
        } else {
            customer.setName(FemaleFirstNames.get(random.nextInt(FemaleFirstNames.size())) + " " +
                LastNames.get(random.nextInt(LastNames.size())));
            customer.setImage("female-" + random.nextInt(4));
        }
        customer.setMessage("Hello there! I want to buy your product.");
        customer.setPrice(300.0 + random.nextInt(300));
        customer.setExpireAt(expiredAt);
        customer.setCity(city);
        customer.setPlayer(player);
        customer = customerRepository.save(customer);
        scheduleExpireCustomer(playerId, customer.getId(), expiredAt);
        if (scheduleAdd) {
            scheduleAddCustomer(playerId);
        }
    }

    public void scheduleExpireCustomer(Long playerId, Long customerId, Date expireAt) throws SchedulerException {
        JobDetail jobDetail = buildExpireCustomerJobDetail(playerId, customerId);
        Trigger trigger = buildJobTrigger(jobDetail, expireAt);
        scheduler.scheduleJob(jobDetail, trigger);
    }

    public void scheduleAddCustomer(Long playerId) throws SchedulerException {
        JobDetail jobDetail = buildAddCustomerJobDetail(playerId);
        Trigger trigger = buildJobTrigger(jobDetail, Date.from(Instant.now().plusSeconds(3600)));
        scheduler.scheduleJob(jobDetail, trigger);
    }

    private JobDetail buildExpireCustomerJobDetail(Long playerId, Long customerId) {
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("playerId", playerId);
        jobDataMap.put("customerId", customerId);
        return JobBuilder.newJob(ExpireCustomerJob.class)
            .withIdentity(UUID.randomUUID().toString(), ExpireCustomerJob.GROUP_NAME + playerId.toString())
            .withDescription("Expire customer job")
            .usingJobData(jobDataMap)
            .storeDurably()
            .build();
    }

    private JobDetail buildAddCustomerJobDetail(Long playerId) {
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("playerId", playerId);
        return JobBuilder.newJob(AddCustomerJob.class)
            .withIdentity(UUID.randomUUID().toString(), AddCustomerJob.GROUP_NAME + playerId.toString())
            .withDescription("Add customer job")
            .usingJobData(jobDataMap)
            .storeDurably()
            .build();
    }

    private Trigger buildJobTrigger(JobDetail jobDetail, Date startAt) {
        return TriggerBuilder.newTrigger()
            .withIdentity(jobDetail.getKey().getName(), "CUSTOMER_JOB_TRIGGERS")
            .withSchedule(SimpleScheduleBuilder.simpleSchedule().withMisfireHandlingInstructionFireNow())
            .startAt(startAt)
            .forJob(jobDetail)
            .build();
    }
}
