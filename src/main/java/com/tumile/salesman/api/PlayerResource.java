package com.tumile.salesman.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tumile.salesman.api.error.RequestValidationException;
import com.tumile.salesman.service.PlayerService;
import com.tumile.salesman.service.dto.request.LoginReq;
import com.tumile.salesman.service.dto.request.RegisterReq;
import com.tumile.salesman.service.dto.response.LoginRes;
import com.tumile.salesman.service.dto.response.PlayerLBRes;
import com.tumile.salesman.service.dto.response.PlayerRes;
import org.quartz.SchedulerException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.ConstraintViolation;
import javax.validation.Valid;
import javax.validation.Validator;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/players")
public class PlayerResource {

    private final PlayerService playerService;
    private final Validator validator;

    public PlayerResource(PlayerService playerService, Validator validator) {
        this.playerService = playerService;
        this.validator = validator;
    }

    @PostMapping("/login")
    public LoginRes login(@Valid @RequestBody LoginReq request) {
        return playerService.login(request);
    }

    @PostMapping(value = "/register")
    public LoginRes register(@RequestPart("body") String body, @RequestPart("image") MultipartFile image)
        throws JsonProcessingException, SchedulerException {
        RegisterReq request = new ObjectMapper().readValue(body, RegisterReq.class);
        Set<ConstraintViolation<RegisterReq>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new RequestValidationException(violations.iterator().next().getMessage());
        }
        return playerService.register(request, image);
    }

    @GetMapping("/leaderboard")
    public List<PlayerLBRes> getLeaderboard() {
        return playerService.getLeaderboard();
    }

    @GetMapping("/me")
    public PlayerRes get() {
        Long playerId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        return playerService.get(playerId);
    }

    @GetMapping("/{playerId}")
    public PlayerRes getById(@PathVariable Long playerId) {
        return playerService.get(playerId);
    }
}
