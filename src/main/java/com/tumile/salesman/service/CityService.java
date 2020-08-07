package com.tumile.salesman.service;

import com.tumile.salesman.service.dto.response.CityRes;
import com.tumile.salesman.service.dto.response.CitySimpleRes;
import com.tumile.salesman.service.dto.response.FlightRes;

import java.util.List;

public interface CityService {

    CityRes handleGet(Long id);

    List<CitySimpleRes> handleSearch(String query);

    List<FlightRes> handleSearchFlights(Long cityId1, Long cityId2);

    double getFlightDuration(Long cityId1, Long cityId2);

    double getAirfare(Long cityId1, Long cityId2, Long airlineId);
}
