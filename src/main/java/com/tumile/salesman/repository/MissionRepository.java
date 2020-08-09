package com.tumile.salesman.repository;

import com.tumile.salesman.domain.Mission;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface MissionRepository extends CrudRepository<Mission, Long> {

    Mission findByPlayerIdAndTitle(Long playerId, String title);

    List<Mission> findAllByPlayerId(Long playerId);
}
