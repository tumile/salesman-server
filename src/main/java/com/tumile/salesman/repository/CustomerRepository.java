package com.tumile.salesman.repository;

import com.tumile.salesman.domain.Customer;
import org.springframework.data.repository.CrudRepository;

public interface CustomerRepository extends CrudRepository<Customer, Long> {
}
