package com.tumile.salesman.service;

import com.tumile.salesman.api.error.NotFoundException;
import com.tumile.salesman.api.error.UsernameUsedException;
import com.tumile.salesman.domain.City;
import com.tumile.salesman.domain.Player;
import com.tumile.salesman.repository.CityRepository;
import com.tumile.salesman.repository.PlayerRepository;
import com.tumile.salesman.security.jwt.TokenProvider;
import com.tumile.salesman.service.dto.request.FlightReq;
import com.tumile.salesman.service.dto.request.LoginReq;
import com.tumile.salesman.service.dto.request.RegisterReq;
import com.tumile.salesman.service.dto.response.LoginRes;
import com.tumile.salesman.service.dto.response.PlayerLBRes;
import com.tumile.salesman.service.dto.response.PlayerRes;
import com.tumile.salesman.service.job.ExpireCustomerJob;
import com.tumile.salesman.service.s3.S3Service;
import org.quartz.*;
import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.data.util.Pair;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PlayerService {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final CityRepository cityRepository;
    private final CustomerService customerService;
    private final PlayerRepository playerRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final S3Service s3Service;
    private final Scheduler scheduler;

    public PlayerService(AuthenticationManagerBuilder authenticationManagerBuilder, CityRepository cityRepository,
                         CustomerService customerService, PlayerRepository playerRepository,
                         PasswordEncoder passwordEncoder, TokenProvider tokenProvider, S3Service s3Service,
                         Scheduler scheduler) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.cityRepository = cityRepository;
        this.customerService = customerService;
        this.playerRepository = playerRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.s3Service = s3Service;
        this.scheduler = scheduler;
    }

    public LoginRes login(LoginReq request) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        boolean rememberMe = request.isRememberMe();
        String jwt = tokenProvider.createToken(authentication, rememberMe);
        return new LoginRes(jwt);
    }

    @Transactional
    public LoginRes register(RegisterReq request, MultipartFile image) throws SchedulerException {
        playerRepository.findOneByUsername(request.getUsername()).ifPresent(player -> {
            throw new UsernameUsedException();
        });
        String imageURL = s3Service.upload(image, request.getUsername());
        Player player = new Player();
        String encryptedPassword = passwordEncoder.encode(request.getPassword());
        player.setUsername(request.getUsername());
        player.setPassword(encryptedPassword);
        player.setImage(imageURL);
        player.setMoney(1000.0);
        player.setStamina(100);
        player.setCity(cityRepository.findById(1L).orElse(null));
        playerRepository.save(player);
        customerService.addCustomer(player.getId(), false);
        customerService.addCustomer(player.getId(), false);
        customerService.addCustomer(player.getId(), true);
        boolean rememberMe = request.isRememberMe();
        String jwt = tokenProvider.createToken(player.getId().toString(), rememberMe);
        return new LoginRes(jwt);
    }

    public PlayerRes get(Long playerId) {
        Player player = playerRepository.findById(playerId).orElseThrow(() -> new NotFoundException("Player not found"));
        return PlayerRes.fromPlayer(player);
    }

    public List<PlayerLBRes> getLeaderboard() {
        return playerRepository.findTop10ByOrderByMoneyDesc().stream().map(PlayerLBRes::fromPlayer).collect(Collectors.toList());
    }

    public void travel(Long playerId, FlightReq flight) throws SchedulerException {
        Player player = playerRepository.findById(playerId).orElseThrow(() ->
            new NotFoundException("Player not found"));
        City toCity = cityRepository.findById(flight.getToCityId()).orElseThrow(() ->
            new NotFoundException("City not found"));
        player.setCity(toCity);
        player.setMoney(player.getMoney() - flight.getPrice());
        player.setStamina(player.getStamina() - 20);

        double distance = CityService.distances.get(Pair.of(flight.getFromCityId(), flight.getToCityId()));
        long timePassed = Math.round(distance / 925000 * 3600000);

        Set<JobKey> expireJobKeys = scheduler.getJobKeys(GroupMatcher.groupEquals(ExpireCustomerJob.GROUP_NAME + playerId.toString()));
        for (JobKey key : expireJobKeys) {
            JobDetail job = scheduler.getJobDetail(key);
            Trigger trigger = scheduler.getTriggersOfJob(key).get(0);
            long timeLeft = trigger.getStartTime().getTime() - new Date().getTime();
            if (timeLeft > timePassed) {
                scheduler.rescheduleJob(trigger.getKey(), buildJobTrigger(job, Instant.now().plusMillis(timeLeft - timePassed)));
            } else {
                customerService.expireCustomer(playerId, job.getJobDataMap().getLong("customerId"));
                scheduler.deleteJob(key);
            }
        }

        Set<JobKey> spawnJobKeys = scheduler.getJobKeys(GroupMatcher.groupEquals(ExpireCustomerJob.GROUP_NAME + playerId.toString()));
        for (JobKey key : spawnJobKeys) {
            JobDetail job = scheduler.getJobDetail(key);
            Trigger trigger = scheduler.getTriggersOfJob(key).get(0);
            long timeLeft = trigger.getStartTime().getTime() - new Date().getTime();
            if (timeLeft > timePassed) {
                scheduler.rescheduleJob(trigger.getKey(), buildJobTrigger(job, Instant.now().plusMillis(timeLeft - timePassed)));
            } else {
                customerService.addCustomer(playerId, false);
                timeLeft = timePassed - timeLeft;
                while (timeLeft >= 3600000) {
                    customerService.addCustomer(playerId, false);
                    timeLeft -= 3600000;
                }
                scheduler.rescheduleJob(trigger.getKey(), buildJobTrigger(job, Instant.now().plusMillis(timeLeft)));
            }
        }

        playerRepository.save(player);
    }

    private Trigger buildJobTrigger(JobDetail jobDetail, Instant startAt) {
        return TriggerBuilder.newTrigger()
            .withIdentity(jobDetail.getKey().getName(), "CUSTOMER_JOB_TRIGGERS")
            .withSchedule(SimpleScheduleBuilder.simpleSchedule().withMisfireHandlingInstructionFireNow())
            .startAt(Date.from(startAt))
            .forJob(jobDetail)
            .build();
    }
}
