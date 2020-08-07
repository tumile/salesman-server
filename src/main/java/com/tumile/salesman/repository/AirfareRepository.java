package com.tumile.salesman.repository;

import com.tumile.salesman.domain.Airfare;
import org.springframework.data.repository.CrudRepository;

public interface AirfareRepository extends CrudRepository<Airfare, Airfare.AirfareId> {
}
