package com.tumile.salesman.service.impl;

import com.tumile.salesman.api.error.NotFoundException;
import com.tumile.salesman.domain.Customer;
import com.tumile.salesman.domain.Player;
import com.tumile.salesman.repository.CustomerRepository;
import com.tumile.salesman.repository.PlayerRepository;
import com.tumile.salesman.service.CustomerService;
import com.tumile.salesman.service.Utils;
import com.tumile.salesman.service.dto.response.CustomerRes;
import com.tumile.salesman.service.dto.response.NegotiateRes;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerServiceImpl implements CustomerService {

    private static final NotFoundException CUSTOMER_NOT_FOUND = new NotFoundException("Customer not found");
    private static final NotFoundException PLAYER_NOT_FOUND = new NotFoundException("Player not found");
    private final CustomerRepository customerRepository;
    private final PlayerRepository playerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository, PlayerRepository playerRepository) {
        this.customerRepository = customerRepository;
        this.playerRepository = playerRepository;
    }

    @Override
    public List<CustomerRes> handleGetCustomers() {
        return customerRepository.findAllByPlayerId(Utils.getPlayerId())
            .stream()
            .map(CustomerRes::fromCustomer)
            .collect(Collectors.toList());
    }

    @Override
    public void handleSell(Long customerId) {
        Customer customer = customerRepository.findById(customerId).orElseThrow(() -> CUSTOMER_NOT_FOUND);
        Player player = playerRepository.findById(Utils.getPlayerId()).orElseThrow(() -> PLAYER_NOT_FOUND);

        ensureMyCustomer(customer, player);
        ensureSameCity(customer, player);

        player.setMoney(player.getMoney() + customer.getPrice());
        playerRepository.save(player);
        customerRepository.deleteById(customerId);
    }

    @Override
    public void handleReject(Long customerId) {
        Customer customer = customerRepository.findById(customerId).orElseThrow(() -> CUSTOMER_NOT_FOUND);
        Player player = playerRepository.findById(Utils.getPlayerId()).orElseThrow(() -> PLAYER_NOT_FOUND);

        ensureMyCustomer(customer, player);
        ensureSameCity(customer, player);

        customerRepository.deleteById(customerId);
    }

    @Override
    public NegotiateRes handleNegotiate(Long customerId, Double proposedPrice) {
        Customer customer = customerRepository.findById(customerId).orElseThrow(() -> CUSTOMER_NOT_FOUND);
        Player player = playerRepository.findById(Utils.getPlayerId()).orElseThrow(() -> PLAYER_NOT_FOUND);

        ensureMyCustomer(customer, player);
        ensureSameCity(customer, player);
        ensureEnoughStamina(player);
        ensureNegotiationCount(customer);

        NegotiateRes response = new NegotiateRes();
        if (proposedPrice > customer.getMaxPrice()) {
            response.setSucceeded(false);
        } else {
            customer.setPrice(proposedPrice);
            response.setSucceeded(true);
        }
        player.setStamina(player.getStamina() - 5);
        customer.setNegotiationCount(customer.getNegotiationCount() + 1);
        playerRepository.save(player);
        customerRepository.save(customer);
        return response;
    }

    private void ensureMyCustomer(Customer customer, Player player) {
        if (!customer.getPlayer().getId().equals(player.getId())) {
            throw new IllegalArgumentException("They're not your customer");
        }
    }

    private void ensureSameCity(Customer customer, Player player) {
        if (!customer.getCity().getId().equals(player.getCity().getId())) {
            throw new IllegalArgumentException("You're not in the same city with the customer");
        }
    }

    private void ensureEnoughStamina(Player player) {
        if (player.getStamina() < 5) {
            throw new IllegalArgumentException("You've run out of stamina");
        }
    }

    private void ensureNegotiationCount(Customer customer) {
        if (customer.getNegotiationCount() >= 3) {
            throw new IllegalArgumentException("You can't negotiate anymore");
        }
    }
}
