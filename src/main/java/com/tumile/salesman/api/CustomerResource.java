package com.tumile.salesman.api;

import com.tumile.salesman.service.CustomerService;
import com.tumile.salesman.service.dto.response.CustomerRes;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerResource {

    private final CustomerService customerService;

    public CustomerResource(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<CustomerRes> get() {
        Long playerId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        return customerService.getCustomers(playerId);
    }

    @DeleteMapping("/{customerId}")
    public void expire(@PathVariable Long customerId) {
        Long playerId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        customerService.expireCustomer(playerId, customerId);
    }
}
