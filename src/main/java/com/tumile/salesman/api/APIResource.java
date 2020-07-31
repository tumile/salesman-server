package com.tumile.salesman.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tumile.salesman.service.CityService;
import com.tumile.salesman.service.PlayerService;
import com.tumile.salesman.service.dto.request.LoginReq;
import com.tumile.salesman.service.dto.request.RegisterReq;
import com.tumile.salesman.service.dto.request.TravelReq;
import com.tumile.salesman.service.dto.response.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.ConstraintViolation;
import javax.validation.Valid;
import javax.validation.Validator;
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

    @PostMapping("/login")
    public LoginRes login(@Valid @RequestBody LoginReq request) {
        return playerService.login(request);
    }

    @PostMapping("/register")
    public LoginRes register(@RequestPart("body") String body, @RequestPart("image") MultipartFile image) {
        try {
            RegisterReq request = new ObjectMapper().readValue(body, RegisterReq.class);
            Set<ConstraintViolation<RegisterReq>> violations = validator.validate(request);
            if (!violations.isEmpty()) {
                throw new IllegalArgumentException(violations.iterator().next().getMessage());
            }
            return playerService.register(request, image);
        } catch (JsonProcessingException ex) {
            throw new IllegalArgumentException("Invalid JSON");
        }
    }

    @GetMapping("/players/me")
    public PlayerRes getCurrentPlayer() {
        Long playerId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        return playerService.getById(playerId);
    }

    @GetMapping("/players/leaderboard")
    public List<PlayerLBRes> getLeaderboard() {
        return playerService.getLeaderboard();
    }

    @GetMapping("/players/{playerId}")
    public PlayerRes getPlayerById(@PathVariable Long playerId) {
        return playerService.getById(playerId);
    }

    @PostMapping("/travel")
    public void travel(@Valid @RequestBody TravelReq flight) {
        Long playerId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        playerService.travel(playerId, flight);
    }

    @GetMapping("/customers")
    public List<CustomerRes> getCustomers() {
        Long playerId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        return playerService.getCustomers(playerId);
    }

    @PutMapping("/customers/{customerId}")
    public void expireCustomer(@PathVariable Long customerId) {
        Long playerId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        playerService.expireCustomer(playerId, customerId);
    }

    @GetMapping("/cities/search")
    public List<CitySimpleRes> searchCity(@RequestParam String query) {
        return cityService.search(query);
    }

    @GetMapping("/cities/{cityId}")
    public CityRes getCityById(@PathVariable Long cityId) {
        return cityService.getById(cityId);
    }

    @GetMapping("/cities/{city1Id}/{city2Id}/flights")
    public List<FlightRes> getFlights(@PathVariable Long city1Id, @PathVariable Long city2Id) {
        return cityService.getFlights(city1Id, city2Id);
    }
}
