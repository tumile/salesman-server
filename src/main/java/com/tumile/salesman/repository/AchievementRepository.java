package com.tumile.salesman.repository;

import com.tumile.salesman.domain.Achievement;
import org.springframework.data.repository.CrudRepository;

public interface AchievementRepository extends CrudRepository<Achievement, Long> {

    Achievement findByPlayerIdAndTag(Long playerId, String tag);
}
