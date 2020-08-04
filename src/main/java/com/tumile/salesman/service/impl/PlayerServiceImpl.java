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
public class PlayerService implements PlayerService {

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

    public PlayerService(AuthenticationManagerBuilder authenticationManagerBuilder, CityRepository cityRepository,
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
        return playerRepository.findTop5ByOrderByMoneyDesc()
            .stream()
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

    @Transactional
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
        try {
            addThenScheduleExpireCustomer(player);
            addThenScheduleExpireCustomer(player);
            addThenScheduleExpireCustomer(player);
            scheduleAddCustomer(player.getId(), AddCustomerJob.TIME_MILLIS);
        } catch (SchedulerException ex) {
            throw new IllegalStateException(ex.getMessage());
        }
    }

    @Transactional
    public void handleTravel(TravelReq flight) {
        Long playerId = getCurrentPlayerId();

        Player player = playerRepository.findById(playerId)
            .orElseThrow(() -> new NotFoundException("Player not found"));
        cityRepository.findById(flight.getFromCityId())
            .orElseThrow(() -> new NotFoundException("From city not found"));
        City toCity = cityRepository.findById(flight.getToCityId())
            .orElseThrow(() -> new NotFoundException("To city not found"));

        var id = new FlightInfo.FlightInfoId();
        id.setFromCityId(Math.min(flight.getFromCityId(), flight.getToCityId()));
        id.setToCityId(Math.max(flight.getFromCityId(), flight.getToCityId()));
        FlightInfo info = flightInfoRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Info not found"));
        double duration = info.getDuration();

        try {
            Set<JobKey> expireJobKeys =
                scheduler.getJobKeys(GroupMatcher.groupStartsWith(ExpireCustomerJob.buildGroupName(playerId)));
            for (JobKey key : expireJobKeys) {
                JobDetail job = scheduler.getJobDetail(key);
                Trigger trigger = scheduler.getTriggersOfJob(key).get(0);
                long timeLeft = trigger.getStartTime().getTime() - new Date().getTime() - (long) duration;
                if (timeLeft > 0) {
                    scheduler.rescheduleJob(trigger.getKey(), buildJobTrigger(job,
                        Date.from(Instant.now().plusMillis(timeLeft))));
                } else {
                    expireCustomer(job.getJobDataMap().getLong("customerId"));
                    scheduler.deleteJob(key);
                }
            }

            Set<JobKey> addJobKeys =
                scheduler.getJobKeys(GroupMatcher.groupEquals(AddCustomerJob.buildGroupName(playerId)));
            for (JobKey key : addJobKeys) {
                JobDetail job = scheduler.getJobDetail(key);
                Trigger trigger = scheduler.getTriggersOfJob(key).get(0);
                long timeLeft = trigger.getStartTime().getTime() - new Date().getTime() - (long) duration;
                if (timeLeft > 0) {
                    scheduler.rescheduleJob(trigger.getKey(), buildJobTrigger(job,
                        Date.from(Instant.now().plusMillis(timeLeft))));
                } else {
                    addCustomer(player);
                    timeLeft = -timeLeft;
                    while (timeLeft >= AddCustomerJob.TIME_MILLIS) {
                        addCustomer(player);
                        timeLeft -= AddCustomerJob.TIME_MILLIS;
                    }
                    scheduler.rescheduleJob(trigger.getKey(), buildJobTrigger(job,
                        Date.from(Instant.now().plusMillis(timeLeft))));
                }
            }
        } catch (SchedulerException ex) {
            throw new IllegalStateException(ex.getMessage());
        }

        player.setCity(toCity);
        player.setMoney(player.getMoney() - flight.getPrice());
        player.setStamina(player.getStamina() - 20);
        playerRepository.save(player);
    }

    @Override
    public void handleSell(SellReq request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
            .orElseThrow(() -> new NotFoundException("Customer not found"));
        if (!customer.getPlayer().getId().equals(getCurrentPlayerId())) {
            throw new IllegalArgumentException("Not your customer!");
        }
        customer.setExpireAt(null);
        customer.setIsExpired(true);
        customerRepository.save(customer);
    }

    @Transactional
    public void addCustomer(Long playerId) {
        Player player = playerRepository.findById(playerId)
            .orElseThrow(() -> new NotFoundException("Player not found"));
        addThenScheduleExpireCustomer(player);
    }

    @Override
    public void expireCustomer(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new NotFoundException("Customer not found"));
        customer.setExpireAt(null);
        customer.setIsExpired(true);
        customerRepository.save(customer);
    }

    @Transactional
    public void addThenScheduleExpireCustomer(Player player) {
        List<Customer> customers = player.getCustomers().stream().filter(customer -> !customer.getIsExpired())
            .collect(Collectors.toList());
        if (customers.size() >= 3) {
            return;
        }

        List<Long> cityIds = customers.stream().map(customer -> customer.getCity().getId())
            .collect(Collectors.toList());
        if (cityIds.isEmpty()) {
            cityIds.add(-1L);
        }
        List<City> availableCities = cityRepository.findAllByIdNotIn(cityIds);
        City city = availableCities.get(random.nextInt(availableCities.size()));

        long expiredIn = ExpireCustomerJob.TIME_MILLIS;
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
        player.getCustomers().add(customer);
        playerRepository.save(player);

        scheduleExpireCustomer(player.getId(), customer.getId(), expiredIn);
    }

    public void rescheduleAddCustomer(Long playerId,)

    public void endJob(Job) {
        JobKey key = jobs.iterator().next();
        JobDetail job = scheduler.getJobDetail(key);
        Trigger trigger = scheduler.getTriggersOfJob(key).get(0);
        scheduler.rescheduleJob(trigger.getKey(), buildJobTrigger(job,
            Date.from(Instant.now().plusMillis(duration))));
    }

    public void scheduleAddCustomer(Long playerId, long duration) throws SchedulerException {
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("playerId", playerId);
        JobDetail jobDetail = JobBuilder.newJob(AddCustomerJob.class)
            .withIdentity(UUID.randomUUID().toString(), AddCustomerJob.buildGroupName(playerId))
            .withDescription("Add customer for player " + playerId)
            .usingJobData(jobDataMap)
            .storeDurably()
            .build();
        Trigger trigger = buildJobTrigger(jobDetail, Date.from(Instant.now().plusMillis(duration)));
        scheduler.scheduleJob(jobDetail, trigger);
    }

    public void scheduleExpireCustomer(Long playerId, Long customerId, long duration) throws SchedulerException {
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("playerId", playerId);
        jobDataMap.put("customerId", customerId);
        JobDetail jobDetail = JobBuilder.newJob(ExpireCustomerJob.class)
            .withIdentity(UUID.randomUUID().toString(), ExpireCustomerJob.buildGroupName(playerId, customerId))
            .usingJobData(jobDataMap)
            .storeDurably()
            .build();
        Trigger trigger = buildJobTrigger(jobDetail, Date.from(Instant.now().plusMillis(duration)));
        scheduler.scheduleJob(jobDetail, trigger);
    }

    private Trigger buildJobTrigger(JobDetail jobDetail, Date startAt) {
        return TriggerBuilder.newTrigger()
            .withIdentity(jobDetail.getKey().getName(), jobDetail.getKey().getGroup())
            .withSchedule(SimpleScheduleBuilder.simpleSchedule().withMisfireHandlingInstructionFireNow())
            .startAt(startAt)
            .forJob(jobDetail)
            .build();
    }
}
