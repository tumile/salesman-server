package com.tumile.salesman.service.impl;

import com.tumile.salesman.api.error.NotFoundException;
import com.tumile.salesman.domain.City;
import com.tumile.salesman.domain.Customer;
import com.tumile.salesman.domain.Player;
import com.tumile.salesman.repository.CityRepository;
import com.tumile.salesman.repository.CustomerRepository;
import com.tumile.salesman.repository.PlayerRepository;
import com.tumile.salesman.service.JobService;
import com.tumile.salesman.service.job.AddCustomerJob;
import com.tumile.salesman.service.job.ExpireCustomerJob;
import com.tumile.salesman.service.job.StaminaRegenJob;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

import static com.tumile.salesman.service.Utils.*;

@Slf4j
@Service
public class JobServiceImpl implements JobService {

    private static final Random random = new Random();
    private final CityRepository cityRepository;
    private final CustomerRepository customerRepository;
    private final PlayerRepository playerRepository;
    private final Scheduler scheduler;

    public JobServiceImpl(CityRepository cityRepository, CustomerRepository customerRepository,
                          PlayerRepository playerRepository, Scheduler scheduler) {
        this.cityRepository = cityRepository;
        this.customerRepository = customerRepository;
        this.playerRepository = playerRepository;
        this.scheduler = scheduler;
    }

    @Override
    public void addCustomerAndScheduleExpire(Long playerId) {
        Player player = playerRepository.findById(playerId)
            .orElseThrow(() -> new NotFoundException("Player not found"));
        List<Long> cityIds = customerRepository.findAllByPlayerId(playerId).stream()
            .map(Customer::getCity)
            .map(City::getId)
            .collect(Collectors.toList());
        if (cityIds.isEmpty()) {
            cityIds.add(-1L);
        }
        List<City> availableCities = cityRepository.findAllByIdNotIn(cityIds);
        City city = availableCities.get(random.nextInt(availableCities.size()));
        long expireIn = ExpireCustomerJob.TIME_MILLIS + random.nextInt(7200000);
        Customer customer = new Customer();
        boolean isMale = random.nextBoolean();
        if (isMale) {
            customer.setName(MFN.get(random.nextInt(MFN.size())) + " " + LN.get(random.nextInt(LN.size())));
            customer.setImage("https://salesman-public.s3.amazonaws.com/male-" + random.nextInt(13) + ".png");
        } else {
            customer.setName(FFN.get(random.nextInt(FFN.size())) + " " + LN.get(random.nextInt(LN.size())));
            customer.setImage("https://salesman-public.s3.amazonaws.com/female-" + random.nextInt(11) + ".png");
        }
        customer.setMessage("Hello there! I want to buy your product.");
        customer.setPrice(300.0 + random.nextInt(300));
        customer.setMaxPrice(customer.getPrice() + (customer.getPrice() * (random.nextInt(15) / 100.0)));
        customer.setExpireAt(Date.from(Instant.now().plusMillis(expireIn)));
        customer.setCity(city);
        customer.setPlayer(player);
        customerRepository.save(customer);
        scheduleExpireCustomer(player.getId(), customer.getId(), expireIn);
    }

    @Override
    public void updateJobsAsTimePassed(Long playerId, long timePassedMillis) {
        try {
            Set<JobKey> expireJobKeys = scheduler
                .getJobKeys(GroupMatcher.groupEquals(ExpireCustomerJob.buildGroupName(playerId)));
            for (JobKey key : expireJobKeys) {
                JobDetail job = scheduler.getJobDetail(key);
                Trigger trigger = scheduler.getTriggersOfJob(key).get(0);
                Long customerId = job.getJobDataMap().getLong("customerId");
                long timeLeft = trigger.getStartTime().getTime() - new Date().getTime() - timePassedMillis;
                if (timeLeft > 0) {
                    Optional<Customer> optCustomer = customerRepository.findById(customerId);
                    if (optCustomer.isPresent()) {
                        Customer customer = optCustomer.get();
                        customer.setExpireAt(Date.from(Instant.now().plusMillis(timeLeft)));
                        customerRepository.save(customer);
                        scheduler.rescheduleJob(trigger.getKey(), buildJobTrigger(job, timeLeft));
                    } else {
                        scheduler.deleteJob(job.getKey());
                    }
                } else {
                    customerRepository.findById(customerId).ifPresent(customerRepository::delete);
                    scheduler.deleteJob(job.getKey());
                }
            }
            Set<JobKey> addJobKeys = scheduler
                .getJobKeys(GroupMatcher.groupEquals(AddCustomerJob.buildGroupName(playerId)));
            for (JobKey key : addJobKeys) {
                JobDetail job = scheduler.getJobDetail(key);
                Trigger trigger = scheduler.getTriggersOfJob(key).get(0);
                long timeLeft = trigger.getStartTime().getTime() - new Date().getTime() - timePassedMillis;
                if (timeLeft <= 0) {
                    addCustomerAndScheduleExpire(playerId);
                    timeLeft = -timeLeft;
                    while (timeLeft >= AddCustomerJob.TIME_MILLIS) {
                        addCustomerAndScheduleExpire(playerId);
                        timeLeft -= AddCustomerJob.TIME_MILLIS;
                    }
                }
                scheduler.rescheduleJob(trigger.getKey(), buildJobTrigger(job, timeLeft));
            }
        } catch (SchedulerException ex) {
            throw new IllegalStateException(ex.getMessage());
        }
    }

    @Override
    public void scheduleAddCustomer(Long playerId, long timeMillis) {
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("playerId", playerId);
        JobDetail jobDetail = JobBuilder.newJob(AddCustomerJob.class)
            .withIdentity(UUID.randomUUID().toString(), AddCustomerJob.buildGroupName(playerId))
            .withDescription("Add customer for player " + playerId)
            .usingJobData(jobDataMap)
            .storeDurably()
            .build();
        Trigger trigger = buildJobTrigger(jobDetail, timeMillis);
        try {
            scheduler.scheduleJob(jobDetail, trigger);
        } catch (SchedulerException ex) {
            throw new IllegalStateException(ex.getMessage());
        }
    }

    @Override
    public void executeAddCustomer(JobExecutionContext context) throws SchedulerException {
        JobDetail job = context.getJobDetail();
        log.info(job.getDescription());
        Long playerId = context.getMergedJobDataMap().getLong("playerId");
        try {
            addCustomerAndScheduleExpire(playerId);
            scheduler.rescheduleJob(context.getTrigger().getKey(), buildJobTrigger(job, AddCustomerJob.TIME_MILLIS));
        } catch (NotFoundException ex) {
            scheduler.deleteJob(job.getKey());
        }
    }

    @Override
    public void scheduleExpireCustomer(Long playerId, Long customerId, long timeMillis) {
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("customerId", customerId);
        JobDetail jobDetail = JobBuilder.newJob(ExpireCustomerJob.class)
            .withIdentity(UUID.randomUUID().toString(), ExpireCustomerJob.buildGroupName(playerId))
            .withDescription("Expire customer " + customerId)
            .usingJobData(jobDataMap)
            .storeDurably()
            .build();
        Trigger trigger = buildJobTrigger(jobDetail, timeMillis);
        try {
            scheduler.scheduleJob(jobDetail, trigger);
        } catch (SchedulerException ex) {
            throw new IllegalStateException(ex.getMessage());
        }
    }

    @Override
    public void executeExpireCustomer(JobExecutionContext context) throws SchedulerException {
        JobDetail job = context.getJobDetail();
        log.info(job.getDescription());
        Long customerId = context.getMergedJobDataMap().getLong("customerId");
        customerRepository.findById(customerId).ifPresent(customerRepository::delete);
        scheduler.deleteJob(job.getKey());
    }

    @Override
    public void scheduleStaminaRegen(Long playerId) {
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("playerId", playerId);
        JobDetail jobDetail = JobBuilder.newJob(StaminaRegenJob.class)
            .withIdentity(UUID.randomUUID().toString(), StaminaRegenJob.buildGroupName(playerId))
            .withDescription("Regen stamina for player " + playerId)
            .usingJobData(jobDataMap)
            .storeDurably()
            .build();
        Trigger trigger = buildRoutineJobTrigger(jobDetail);
        try {
            scheduler.scheduleJob(jobDetail, trigger);
        } catch (SchedulerException ex) {
            throw new IllegalStateException(ex.getMessage());
        }
    }

    @Override
    public void executeStaminaRegen(JobExecutionContext context) throws SchedulerException {
        JobDetail job = context.getJobDetail();
        log.info(job.getDescription());
        Long playerId = context.getMergedJobDataMap().getLong("playerId");
        Player player = playerRepository.findById(playerId).orElse(null);
        if (player == null) {
            scheduler.deleteJob(job.getKey());
        } else if (player.getStamina() < 100) {
            player.setStamina(player.getStamina() + Math.min(10, 100 - player.getStamina()));
            playerRepository.save(player);
        }
    }

    private Trigger buildRoutineJobTrigger(JobDetail jobDetail) {
        return TriggerBuilder.newTrigger()
            .withIdentity(jobDetail.getKey().getName(), jobDetail.getKey().getGroup())
            .withDescription(jobDetail.getDescription())
            .withSchedule(SimpleScheduleBuilder.repeatMinutelyForever(10).withMisfireHandlingInstructionFireNow())
            .forJob(jobDetail)
            .build();
    }

    private Trigger buildJobTrigger(JobDetail jobDetail, long timeMillis) {
        return TriggerBuilder.newTrigger()
            .withIdentity(jobDetail.getKey().getName(), jobDetail.getKey().getGroup())
            .withDescription(jobDetail.getDescription())
            .withSchedule(SimpleScheduleBuilder.simpleSchedule().withMisfireHandlingInstructionFireNow())
            .startAt(Date.from(Instant.now().plusMillis(timeMillis)))
            .forJob(jobDetail)
            .build();
    }
}
