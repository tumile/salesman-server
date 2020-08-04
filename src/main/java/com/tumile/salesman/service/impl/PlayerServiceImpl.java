package com.tumile.salesman.service.impl;

import com.tumile.salesman.api.error.NotFoundException;
import com.tumile.salesman.domain.City;
import com.tumile.salesman.domain.Customer;
import com.tumile.salesman.domain.FlightInfo;
import com.tumile.salesman.domain.Player;
import com.tumile.salesman.repository.CityRepository;
import com.tumile.salesman.repository.CustomerRepository;
import com.tumile.salesman.repository.FlightInfoRepository;
import com.tumile.salesman.repository.PlayerRepository;
import com.tumile.salesman.security.jwt.TokenProvider;
import com.tumile.salesman.service.PlayerService;
import com.tumile.salesman.service.dto.request.LoginReq;
import com.tumile.salesman.service.dto.request.RegisterReq;
import com.tumile.salesman.service.dto.request.SellReq;
import com.tumile.salesman.service.dto.request.TravelReq;
import com.tumile.salesman.service.dto.response.CustomerRes;
import com.tumile.salesman.service.dto.response.PlayerLBRes;
import com.tumile.salesman.service.dto.response.PlayerRes;
import com.tumile.salesman.service.dto.response.TokenRes;
import com.tumile.salesman.service.job.AddCustomerJob;
import com.tumile.salesman.service.job.ExpireCustomerJob;
import com.tumile.salesman.service.s3.S3Service;
import org.quartz.*;
import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import static com.tumile.salesman.service.Constants.*;

@Service
public class PlayerServiceImpl implements PlayerService {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final CityRepository cityRepository;
    private final CustomerRepository customerRepository;
    private final FlightInfoRepository flightInfoRepository;
    private final PlayerRepository playerRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final S3Service s3Service;
    private final Scheduler scheduler;
    private final Random random = new Random();

    public PlayerServiceImpl(AuthenticationManagerBuilder authenticationManagerBuilder, CityRepository cityRepository,
                             CustomerRepository customerRepository, FlightInfoRepository flightInfoRepository,
                             PlayerRepository playerRepository, PasswordEncoder passwordEncoder,
                             TokenProvider tokenProvider, S3Service s3Service, Scheduler scheduler) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.cityRepository = cityRepository;
        this.customerRepository = customerRepository;
        this.flightInfoRepository = flightInfoRepository;
        this.playerRepository = playerRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.s3Service = s3Service;
        this.scheduler = scheduler;
    }

    @Override
    public PlayerRes handleGet(Long playerId) {
        return playerRepository.findById(playerId)
            .map(PlayerRes::fromPlayer)
            .orElseThrow(() -> new NotFoundException("Player not found"));
    }

    @Override
    public List<PlayerLBRes> handleGetLeaderboard() {
        return playerRepository.findTop5ByOrderByMoneyDesc().stream()
            .map(PlayerLBRes::fromPlayer)
            .collect(Collectors.toList());
    }

    @Override
    public List<CustomerRes> handleGetCustomers() {
        return playerRepository.findById(getCurrentPlayerId())
            .map(player -> player.getCustomers().stream().map(CustomerRes::fromCustomer).collect(Collectors.toList()))
            .orElseThrow(() -> new NotFoundException("Player not found"));
    }

    private Long getCurrentPlayerId() {
        return Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
    }

    @Override
    public TokenRes handleLogin(LoginReq request) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        boolean rememberMe = request.isRememberMe();
        String jwt = tokenProvider.createToken(authentication, rememberMe);
        return new TokenRes(jwt);
    }

    @Override
    public TokenRes handleRegister(RegisterReq request) {
        ensureUsername(request.getUsername());
        String imageURL = s3Service.upload(request.getImage(), request.getUsername());
        String encryptedPassword = passwordEncoder.encode(request.getPassword());
        Player player = new Player();
        player.setUsername(request.getUsername());
        player.setPassword(encryptedPassword);
        player.setImage(imageURL);
        player.setMoney(1000.0);
        player.setStamina(100);
        player.setCity(cityRepository.findById(1L).orElse(null));
        playerRepository.save(player);
        initCustomers(player);
        boolean rememberMe = request.isRememberMe();
        String jwt = tokenProvider.createToken(player.getId().toString(), rememberMe);
        return new TokenRes(jwt);
    }

    private void ensureUsername(String username) {
        playerRepository.findOneByUsername(username).ifPresent(player -> {
            throw new IllegalArgumentException("Username already taken");
        });
    }

    private void initCustomers(Player player) {
        addCustomerAndScheduleExpire(player);
        addCustomerAndScheduleExpire(player);
        addCustomerAndScheduleExpire(player);
        scheduleAddCustomer(player.getId(), AddCustomerJob.TIME_MILLIS);
    }

    @Override
    public void handleTravel(TravelReq request) {
        Player player = playerRepository.findById(getCurrentPlayerId())
            .orElseThrow(() -> new NotFoundException("Player not found"));
        City fromCity = cityRepository.findById(request.getFromCityId())
            .orElseThrow(() -> new NotFoundException("From city not found"));
        City toCity = cityRepository.findById(request.getToCityId())
            .orElseThrow(() -> new NotFoundException("To city not found"));

        double duration = flightInfoRepository.findById(new FlightInfo.FlightInfoId(
            Math.min(fromCity.getId(), toCity.getId()),
            Math.max(fromCity.getId(), toCity.getId())
        ))
            .orElseThrow(() -> new NotFoundException("Info not found"))
            .getDuration();

        updateAddAndExpireCustomers(player, (long) duration);
        player.setCity(toCity);
        player.setMoney(player.getMoney() - request.getPrice());
        player.setStamina(player.getStamina() - 33);
        playerRepository.save(player);
    }

    @Override
    public void handleSell(SellReq request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
            .orElseThrow(() -> new NotFoundException("Customer not found"));
        Player player = playerRepository.findById(getCurrentPlayerId())
            .orElseThrow(() -> new NotFoundException("Player not found"));
        if (!customer.getPlayer().getId().equals(player.getId())) {
            throw new IllegalArgumentException("Not your customer!");
        }
        try {
            Set<JobKey> expireJobKeys = scheduler
                .getJobKeys(GroupMatcher.groupEquals(ExpireCustomerJob.buildGroupName(player.getId(), customer.getId())));
            expireCustomerAndDeleteJob(customer.getId(), expireJobKeys.iterator().next());
        } catch (SchedulerException ex) {
            throw new IllegalStateException(ex.getMessage());
        }
    }

    @Transactional
    @Override
    public void addCustomerAndRescheduleJob(Long playerId, JobDetail job, Trigger trigger) {
        Player player = playerRepository.findById(playerId)
            .orElseThrow(() -> new NotFoundException("Player not found"));
        addCustomerAndScheduleExpire(player);
        try {
            scheduler.rescheduleJob(trigger.getKey(), buildJobTrigger(job, AddCustomerJob.TIME_MILLIS));
        } catch (SchedulerException ex) {
            throw new IllegalStateException(ex.getMessage());
        }
    }

    @Override
    public void expireCustomerAndDeleteJob(Long customerId, JobKey jobKey) {
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new NotFoundException("Customer not found"));
        customer.setExpireAt(null);
        customer.setIsExpired(true);
        customerRepository.save(customer);
        try {
            scheduler.deleteJob(jobKey);
        } catch (SchedulerException ex) {
            throw new IllegalStateException(ex.getMessage());
        }
    }

    private void updateAddAndExpireCustomers(Player player, long timePassed) {
        try {
            Set<JobKey> expireJobKeys = scheduler
                .getJobKeys(GroupMatcher.groupStartsWith(ExpireCustomerJob.buildGroupName(player.getId())));
            for (JobKey key : expireJobKeys) {
                JobDetail job = scheduler.getJobDetail(key);
                Trigger trigger = scheduler.getTriggersOfJob(key).get(0);
                long timeLeft = trigger.getStartTime().getTime() - new Date().getTime() - timePassed;
                if (timeLeft > 0) {
                    scheduler.rescheduleJob(trigger.getKey(), buildJobTrigger(job, timeLeft));
                    Customer customer = customerRepository.findById(job.getJobDataMap().getLong("customerId"))
                        .orElseThrow();
                    customer.setExpireAt(LocalDateTime.now().plus(timeLeft, ChronoUnit.MILLIS));
                    customerRepository.save(customer);
                } else {
                    expireCustomerAndDeleteJob(job.getJobDataMap().getLong("customerId"), key);
                }
            }
            Set<JobKey> addJobKeys = scheduler
                .getJobKeys(GroupMatcher.groupEquals(AddCustomerJob.buildGroupName(player.getId())));
            for (JobKey key : addJobKeys) {
                JobDetail job = scheduler.getJobDetail(key);
                Trigger trigger = scheduler.getTriggersOfJob(key).get(0);
                long timeLeft = trigger.getStartTime().getTime() - new Date().getTime() - timePassed;
                if (timeLeft <= 0) {
                    addCustomerAndScheduleExpire(player);
                    timeLeft = -timeLeft;
                    while (timeLeft >= AddCustomerJob.TIME_MILLIS) {
                        addCustomerAndScheduleExpire(player);
                        timeLeft -= AddCustomerJob.TIME_MILLIS;
                    }
                }
                scheduler.rescheduleJob(trigger.getKey(), buildJobTrigger(job, timeLeft));
            }
        } catch (SchedulerException ex) {
            throw new IllegalStateException(ex.getMessage());
        }
    }

    @Transactional
    public void addCustomerAndScheduleExpire(Player player) {
        List<Customer> customers = player.getCustomers().stream()
            .filter(customer -> !customer.getIsExpired())
            .collect(Collectors.toList());
        if (customers.size() >= 3) {
            return;
        }
        Customer customer = buildNewCustomer(player, ExpireCustomerJob.TIME_MILLIS);
        player.getCustomers().add(customer);
        customerRepository.save(customer);
        scheduleExpireCustomer(player.getId(), customer.getId(), ExpireCustomerJob.TIME_MILLIS);
    }

    private Customer buildNewCustomer(Player player, long expiredIn) {
        List<Long> cityIds = player.getCustomers().stream()
            .map(Customer::getCity).map(City::getId)
            .collect(Collectors.toList());
        if (cityIds.isEmpty()) {
            cityIds.add(-1L);
        }
        List<City> availableCities = cityRepository.findAllByIdNotIn(cityIds);
        City city = availableCities.get(random.nextInt(availableCities.size()));
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
        customer.setExpireAt(LocalDateTime.now().plus(expiredIn, ChronoUnit.MILLIS));
        customer.setCity(city);
        customer.setPlayer(player);
        return customer;
    }

    private void scheduleAddCustomer(Long playerId, long millis) {
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("playerId", playerId);
        JobDetail jobDetail = JobBuilder.newJob(AddCustomerJob.class)
            .withIdentity(UUID.randomUUID().toString(), AddCustomerJob.buildGroupName(playerId))
            .withDescription("Add customer for player " + playerId)
            .usingJobData(jobDataMap)
            .storeDurably()
            .build();
        Trigger trigger = buildJobTrigger(jobDetail, millis);
        try {
            scheduler.scheduleJob(jobDetail, trigger);
        } catch (SchedulerException ex) {
            throw new IllegalStateException(ex.getMessage());
        }
    }

    private void scheduleExpireCustomer(Long playerId, Long customerId, long millis) {
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("customerId", customerId);
        JobDetail jobDetail = JobBuilder.newJob(ExpireCustomerJob.class)
            .withIdentity(UUID.randomUUID().toString(), ExpireCustomerJob.buildGroupName(playerId, customerId))
            .withDescription("Expire customer " + customerId)
            .usingJobData(jobDataMap)
            .storeDurably()
            .build();
        Trigger trigger = buildJobTrigger(jobDetail, millis);
        try {
            scheduler.scheduleJob(jobDetail, trigger);
        } catch (SchedulerException ex) {
            throw new IllegalStateException(ex.getMessage());
        }
    }

    private Trigger buildJobTrigger(JobDetail jobDetail, long millis) {
        return TriggerBuilder.newTrigger()
            .withIdentity(jobDetail.getKey().getName(), jobDetail.getKey().getGroup())
            .withDescription(jobDetail.getDescription())
            .withSchedule(SimpleScheduleBuilder.simpleSchedule().withMisfireHandlingInstructionFireNow())
            .startAt(Date.from(Instant.now().plusMillis(millis)))
            .forJob(jobDetail)
            .build();
    }
}
