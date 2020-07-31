package com.tumile.salesman.service.dto.response;

import com.tumile.salesman.domain.Customer;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class CustomerRes {

    private Long id;

    private String name;

    private String image;

    private Double price;

    private String message;

    private LocalDateTime expireAt;

    private Boolean isExpired;

    private CitySimpleRes city;

    public static CustomerRes fromCustomer(Customer customer) {
        CustomerRes res = new CustomerRes();
        res.setId(customer.getId());
        res.setName(customer.getName());
        res.setImage(customer.getImage());
        res.setPrice(customer.getPrice());
        res.setMessage(customer.getMessage());
        res.setExpireAt(customer.getExpireAt());
        res.setIsExpired(customer.getIsExpired());
        res.setCity(CitySimpleRes.fromCity(customer.getCity()));
        return res;
    }
}
