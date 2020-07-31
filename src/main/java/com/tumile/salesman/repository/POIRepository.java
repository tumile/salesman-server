package com.tumile.salesman.repository;

import com.tumile.salesman.domain.PointOfInterest;
import org.springframework.data.repository.CrudRepository;

public interface POIRepository extends CrudRepository<PointOfInterest, Long> {
}
