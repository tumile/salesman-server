package com.tumile.salesman.service.dto.response;

import com.tumile.salesman.domain.Airline;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FlightRes {

    private Long id;

    private String name;

    private String image;

    private Double price;

    public static FlightRes fromAirline(Airline airline, double price) {
        FlightRes res = new FlightRes();
        res.setId(airline.getId());
        res.setName(airline.getName());
        res.setImage(airline.getImage());
        res.setPrice(price);
        return res;
    }
}
