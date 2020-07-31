package com.tumile.salesman.api;

import com.tumile.salesman.service.CityService;
import com.tumile.salesman.service.PlayerService;
import com.tumile.salesman.service.dto.request.FlightReq;
import com.tumile.salesman.service.dto.response.FlightRes;
import org.quartz.SchedulerException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightResource {

    public final CityService cityService;
    private final PlayerService playerService;

    public FlightResource(CityService cityService, PlayerService playerService) {
        this.cityService = cityService;
        this.playerService = playerService;
    }

    @GetMapping
    public List<FlightRes> get(@NotBlank @RequestParam Long from, @NotBlank @RequestParam Long to) {
        return cityService.getFlights(from, to);
    }

    @PostMapping
    public void travel(@Valid @RequestBody FlightReq flight) throws SchedulerException {
        Long playerId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        playerService.travel(playerId, flight);
    }
}
