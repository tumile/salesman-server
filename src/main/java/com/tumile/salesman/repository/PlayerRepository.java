package com.tumile.salesman.repository;

import com.tumile.salesman.domain.Player;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface PlayerRepository extends CrudRepository<Player, Long> {

    Optional<Player> findOneByUsername(String username);

    List<Player> findTop5ByOrderByMoneyDesc();
}
