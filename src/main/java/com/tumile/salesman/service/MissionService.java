package com.tumile.salesman.service;

import com.tumile.salesman.domain.Player;
import com.tumile.salesman.service.dto.response.MissionRes;

import java.util.List;

public interface MissionService {

    List<MissionRes> getMissions(Long playerId);

    void initMissions(Player player);

    void updateMoneyMission(Long playerId, Double amount);

    void updateCityVisitMission(Long playerId, Long cityId);
}
