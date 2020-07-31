package com.tumile.salesman.repository;

import com.tumile.salesman.domain.Airline;
import org.springframework.data.repository.CrudRepository;

public interface AirlineRepository extends CrudRepository<Airline, Long> {
}
