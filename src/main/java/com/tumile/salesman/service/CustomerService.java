package com.tumile.salesman.service;

import com.tumile.salesman.service.dto.response.CustomerRes;
import com.tumile.salesman.service.dto.response.NegotiateRes;

import java.util.List;

public interface CustomerService {

    List<CustomerRes> handleGetCustomers();

    void handleSell(Long customerId);

    void handleReject(Long customerId);

    NegotiateRes handleNegotiate(Long customerId, Double proposedPrice);
}
