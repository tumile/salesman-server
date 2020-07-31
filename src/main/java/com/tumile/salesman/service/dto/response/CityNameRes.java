package com.tumile.salesman.service.dto.response;

import com.tumile.salesman.domain.City;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CityNameRes {

    private Long id;

    private String name;

    public static CityNameRes fromCity(City city) {
        CityNameRes res = new CityNameRes();
        res.setId(city.getId());
        res.setName(city.getName());
        return res;
    }
}
