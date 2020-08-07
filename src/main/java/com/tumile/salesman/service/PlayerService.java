package com.tumile.salesman.service;

import com.tumile.salesman.service.dto.request.LoginReq;
import com.tumile.salesman.service.dto.request.RegisterReq;
import com.tumile.salesman.service.dto.request.TravelReq;
import com.tumile.salesman.service.dto.response.PlayerLBRes;
import com.tumile.salesman.service.dto.response.PlayerRes;
import com.tumile.salesman.service.dto.response.TokenRes;

import java.util.List;

public interface PlayerService {

    PlayerRes handleGet();

    PlayerRes handleGet(Long playerId);

    List<PlayerLBRes> handleGetLeaderboard();

    TokenRes handleLogin(LoginReq request);

    TokenRes handleRegister(RegisterReq request);

    void handleTravel(TravelReq request);
}
