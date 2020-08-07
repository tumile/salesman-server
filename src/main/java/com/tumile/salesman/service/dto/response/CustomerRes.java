package com.tumile.salesman.service.dto.response;

import com.tumile.salesman.domain.Customer;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class CustomerRes {

    private Long id;

    private String name;

    private String image;

    private Double price;

    private Integer negotiationCount;

    private String message;

    private Date expireAt;

    private CitySimpleRes city;

    public static CustomerRes fromCustomer(Customer customer) {
        CustomerRes res = new CustomerRes();
        res.setId(customer.getId());
        res.setName(customer.getName());
        res.setImage(customer.getImage());
        res.setPrice(customer.getPrice());
        res.setNegotiationCount(customer.getNegotiationCount());
        res.setMessage(customer.getMessage());
        res.setExpireAt(customer.getExpireAt());
        res.setCity(CitySimpleRes.fromCity(customer.getCity()));
        return res;
    }
}
