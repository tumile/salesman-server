package com.tumile.salesman.repository;

import com.tumile.salesman.domain.City;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CityRepository extends CrudRepository<City, Long> {

    List<City> findAllByNameStartsWith(String query);

    List<City> findAllByIdNotIn(List<Long> ids);
}
