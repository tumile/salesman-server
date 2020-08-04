package com.tumile.salesman.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tumile.salesman.service.CityService;
import com.tumile.salesman.service.PlayerService;
import com.tumile.salesman.service.impl.CityServiceImpl;
import com.tumile.salesman.service.dto.request.LoginReq;
import com.tumile.salesman.service.dto.request.RegisterReq;
import com.tumile.salesman.service.dto.request.SellReq;
import com.tumile.salesman.service.dto.request.TravelReq;
import com.tumile.salesman.service.dto.response.*;
import com.tumile.salesman.service.impl.PlayerServiceImpl;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.ConstraintViolation;
import javax.validation.Valid;
import javax.validation.Validator;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class APIResource {

    private final CityService cityService;
    private final PlayerService playerService;
    private final Validator validator;

    public APIResource(CityService cityService, PlayerService playerService, Validator validator) {
        this.cityService = cityService;
        this.playerService = playerService;
        this.validator = validator;
    }

    @GetMapping("/players/me")
    public PlayerRes getCurrentPlayer() {
        Long playerId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        return playerService.handleGet(playerId);
    }

    @GetMapping("/players/leaderboard")
    public List<PlayerLBRes> getLeaderboard() {
        return playerService.handleGetLeaderboard();
    }

    @GetMapping("/players/{playerId}")
    public PlayerRes getPlayer(@PathVariable Long playerId) {
        return playerService.handleGet(playerId);
    }

    @GetMapping("/customers")
    public List<CustomerRes> getCustomers() {
        return playerService.handleGetCustomers();
    }

    @PostMapping("/login")
    public TokenRes login(@Valid @RequestBody LoginReq request) {
        return playerService.handleLogin(request);
    }

    @PostMapping("/register")
    public TokenRes register(@RequestPart("body") String body, @NotNull @RequestPart("image") MultipartFile image) {
        try {
            RegisterReq request = new ObjectMapper().readValue(body, RegisterReq.class);
            Set<ConstraintViolation<RegisterReq>> violations = validator.validate(request);
            if (!violations.isEmpty()) {
                throw new IllegalArgumentException(violations.iterator().next().getMessage());
            }
            request.setImage(image);
            return playerService.handleRegister(request);
        } catch (JsonProcessingException ex) {
            throw new IllegalArgumentException("Invalid JSON");
        }
    }

    @PostMapping("/travel")
    public void travel(@Valid @RequestBody TravelReq request) {
        playerService.handleTravel(request);
    }

    @PutMapping("/customers/{customerId}")
    public void sell(@PathVariable Long customerId, @Valid @RequestBody SellReq request) {
        request.setCustomerId(customerId);
        playerService.handleSell(request);
    }

    @GetMapping("/cities/search")
    public List<CitySimpleRes> searchCity(@RequestParam String query) {
        return cityService.handleSearch(query);
    }

    @GetMapping("/cities/{cityId}")
    public CityRes getCity(@PathVariable Long cityId) {
        return cityService.handleGet(cityId);
    }

    @GetMapping("/cities/{cityId1}/{cityId2}/flights")
    public List<FlightRes> getFlights(@PathVariable Long cityId1, @PathVariable Long cityId2) {
        return cityService.handleGetFlights(cityId1, cityId2);
    }
}
