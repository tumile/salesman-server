package com.tumile.salesman.service.impl;

import com.tumile.salesman.api.error.NotFoundException;
import com.tumile.salesman.domain.City;
import com.tumile.salesman.domain.Player;
import com.tumile.salesman.repository.CityRepository;
import com.tumile.salesman.repository.PlayerRepository;
import com.tumile.salesman.security.jwt.TokenProvider;
import com.tumile.salesman.service.*;
import com.tumile.salesman.service.dto.request.LoginReq;
import com.tumile.salesman.service.dto.request.RegisterReq;
import com.tumile.salesman.service.dto.request.TravelReq;
import com.tumile.salesman.service.dto.response.MissionRes;
import com.tumile.salesman.service.dto.response.PlayerLBRes;
import com.tumile.salesman.service.dto.response.PlayerRes;
import com.tumile.salesman.service.dto.response.TokenRes;
import com.tumile.salesman.service.job.AddCustomerJob;
import com.tumile.salesman.service.s3.S3Service;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlayerServiceImpl implements PlayerService {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final CityService cityService;
    private final CityRepository cityRepository;
    private final JobService jobService;
    private final PlayerRepository playerRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final S3Service s3Service;
    private final MissionService missionService;

    public PlayerServiceImpl(AuthenticationManagerBuilder authenticationManagerBuilder, CityService cityService,
                             CityRepository cityRepository, JobService jobService, PlayerRepository playerRepository,
                             PasswordEncoder passwordEncoder, TokenProvider tokenProvider, S3Service s3Service,
                             MissionService missionService) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.cityService = cityService;
        this.cityRepository = cityRepository;
        this.jobService = jobService;
        this.playerRepository = playerRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.s3Service = s3Service;
        this.missionService = missionService;
    }

    @Override
    public PlayerRes handleGet() {
        return handleGet(Utils.getPlayerId());
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
    public List<MissionRes> handleGetMissions() {
        return missionService.getMissions(Utils.getPlayerId());
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

        jobService.addCustomerAndScheduleExpire(player.getId());
        jobService.addCustomerAndScheduleExpire(player.getId());
        jobService.addCustomerAndScheduleExpire(player.getId());
        jobService.scheduleAddCustomer(player.getId(), AddCustomerJob.TIME_MILLIS);
        jobService.scheduleStaminaRegen(player.getId());
        missionService.initMissions(player);

        boolean rememberMe = request.isRememberMe();
        String jwt = tokenProvider.createToken(player.getId(), rememberMe);
        return new TokenRes(jwt);
    }

    @Override
    public void handleTravel(TravelReq request) {
        Player player = playerRepository.findById(Utils.getPlayerId())
            .orElseThrow(() -> new NotFoundException("Player not found"));
        City city = cityRepository.findById(request.getToCityId())
            .orElseThrow(() -> new NotFoundException("City not found"));

        ensureDifferentCity(city, player);
        ensureEnoughStamina(player);
        double fare = cityService.getAirfare(player.getCity().getId(), city.getId(), request.getAirlineId());
        ensureEnoughMoney(player, fare);
        long duration = (long) cityService.getFlightDuration(player.getCity().getId(), city.getId());

        jobService.updateJobsAsTimePassed(player.getId(), duration);
        missionService.updateCityVisitMission(player.getId(), city.getId());

        player.setCity(city);
        player.setMoney(player.getMoney() - fare);
        player.setStamina(player.getStamina() - 33);
        playerRepository.save(player);
    }

    private void ensureUsername(String username) {
        playerRepository.findOneByUsername(username).ifPresent(player -> {
            throw new IllegalArgumentException("Username already taken");
        });
    }

    private void ensureDifferentCity(City city, Player player) {
        if (city.getId().equals(player.getCity().getId())) {
            throw new IllegalArgumentException("You're already in " + city.getName());
        }
    }

    private void ensureEnoughStamina(Player player) {
        if (player.getStamina() < 33) {
            throw new IllegalArgumentException("You've run out of stamina");
        }
    }

    private void ensureEnoughMoney(Player player, double amount) {
        if (player.getMoney() < amount) {
            throw new IllegalArgumentException("Not enough money");
        }
    }
}
