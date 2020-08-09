package com.tumile.salesman.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tumile.salesman.service.CityService;
import com.tumile.salesman.service.CustomerService;
import com.tumile.salesman.service.PlayerService;
import com.tumile.salesman.service.dto.request.LoginReq;
import com.tumile.salesman.service.dto.request.NegotiateReq;
import com.tumile.salesman.service.dto.request.RegisterReq;
import com.tumile.salesman.service.dto.request.TravelReq;
import com.tumile.salesman.service.dto.response.*;
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
    private final CustomerService customerService;
    private final PlayerService playerService;
    private final Validator validator;

    public APIResource(CityService cityService, CustomerService customerService, PlayerService playerService,
                       Validator validator) {
        this.cityService = cityService;
        this.customerService = customerService;
        this.playerService = playerService;
        this.validator = validator;
    }

    @GetMapping("/players/me")
    public PlayerRes getCurrentPlayer() {
        return playerService.handleGet();
    }

    @GetMapping("/players/leaderboard")
    public List<PlayerLBRes> getLeaderboard() {
        return playerService.handleGetLeaderboard();
    }

    @GetMapping("/players/missions")
    public List<MissionRes> getMissions() {
        return playerService.handleGetMissions();
    }

    @GetMapping("/players/{playerId}")
    public PlayerRes getPlayer(@PathVariable Long playerId) {
        return playerService.handleGet(playerId);
    }

    @GetMapping("/customers")
    public List<CustomerRes> getCustomers() {
        return customerService.handleGetCustomers();
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

    @PostMapping("/customers/{customerId}/sell")
    public void sell(@PathVariable Long customerId) {
        customerService.handleSell(customerId);
    }

    @PostMapping("/customers/{customerId}/reject")
    public void reject(@PathVariable Long customerId) {
        customerService.handleReject(customerId);
    }

    @PostMapping("/customers/{customerId}/negotiate")
    public NegotiateRes negotiate(@PathVariable Long customerId, @Valid @RequestBody NegotiateReq request) {
        return customerService.handleNegotiate(customerId, request.getPrice());
    }

    @GetMapping("/cities/search")
    public List<CitySimpleRes> searchCity(@RequestParam String query) {
        return cityService.handleSearch(query);
    }

    @GetMapping("/cities/flights")
    public List<FlightRes> getFlights(@RequestParam Long from, @RequestParam Long to) {
        return cityService.handleSearchFlights(from, to);
    }

    @GetMapping("/cities/{cityId}")
    public CityRes getCity(@PathVariable Long cityId) {
        return cityService.handleGet(cityId);
    }
}
