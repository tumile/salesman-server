package com.tumile.salesman.service;

import com.tumile.salesman.service.dto.request.LoginReq;
import com.tumile.salesman.service.dto.request.RegisterReq;
import com.tumile.salesman.service.dto.request.SellReq;
import com.tumile.salesman.service.dto.request.TravelReq;
import com.tumile.salesman.service.dto.response.CustomerRes;
import com.tumile.salesman.service.dto.response.PlayerLBRes;
import com.tumile.salesman.service.dto.response.PlayerRes;
import com.tumile.salesman.service.dto.response.TokenRes;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Trigger;

import java.util.List;

public interface PlayerService {

    PlayerRes handleGet(Long playerId);

    List<PlayerLBRes> handleGetLeaderboard();

    List<CustomerRes> handleGetCustomers();

    TokenRes handleLogin(LoginReq request);

    TokenRes handleRegister(RegisterReq request);

    void handleTravel(TravelReq request);

    void handleSell(SellReq request);


    void addCustomerAndRescheduleJob(Long playerId, JobDetail job, Trigger trigger);

    void expireCustomerAndDeleteJob(Long customerId, JobKey jobKey);
}
