package com.tumile.salesman.service.dto.response;

import com.tumile.salesman.domain.City;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CitySimpleRes {

    private Long id;

    private String name;

    public static CitySimpleRes fromCity(City city) {
        CitySimpleRes res = new CitySimpleRes();
        res.setId(city.getId());
        res.setName(city.getName());
        return res;
    }
}
