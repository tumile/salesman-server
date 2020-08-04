package com.tumile.salesman.service.dto.response;

import com.tumile.salesman.domain.Airline;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FlightRes {

    private Long id;

    private String airline;

    private String image;

    private Double price;

    private Double duration;

    public static FlightRes fromAirline(Airline airline, double price, double duration) {
        FlightRes res = new FlightRes();
        res.setId(airline.getId());
        res.setAirline(airline.getName());
        res.setImage(airline.getImage());
        res.setPrice(price);
        res.setDuration(duration);
        return res;
    }
}
