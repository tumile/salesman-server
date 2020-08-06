package com.tumile.salesman.repository;

import com.tumile.salesman.domain.Customer;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CustomerRepository extends CrudRepository<Customer, Long> {

    List<Customer> findAllByPlayerIdAndIsExpiredFalse(Long playerId);
}
