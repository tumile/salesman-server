package com.tumile.salesman.service.dto.response;

import com.tumile.salesman.domain.City;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class CityRes {

    private Long id;

    private String name;

    private Double latitude;

    private Double longitude;

    private Set<POIRes> pointsOfInterest = new HashSet<>();

    public static CityRes fromCity(City city) {
        CityRes res = new CityRes();
        res.setId(city.getId());
        res.setName(city.getName());
        res.setLatitude(city.getLatitude());
        res.setLongitude(city.getLongitude());
        res.setPointsOfInterest(city.getPointsOfInterest().stream().map(POIRes::fromPOI)
            .collect(Collectors.toSet()));
        return res;
    }
}
