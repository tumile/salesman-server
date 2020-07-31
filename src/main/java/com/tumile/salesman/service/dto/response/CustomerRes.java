package com.tumile.salesman.service.dto.response;

import com.tumile.salesman.domain.Customer;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CustomerRes {

    private Long id;

    private String name;

    private String image;

    private Double price;

    private String message;

    private Boolean isExpired;

    private CityNameRes city;

    public static CustomerRes fromCustomer(Customer customer) {
        CustomerRes res = new CustomerRes();
        res.setId(customer.getId());
        res.setName(customer.getName());
        res.setImage(customer.getImage());
        res.setPrice(customer.getPrice());
        res.setMessage(customer.getMessage());
        res.setIsExpired(customer.getIsExpired());
        res.setCity(CityNameRes.fromCity(customer.getCity()));
        return res;
    }
}
