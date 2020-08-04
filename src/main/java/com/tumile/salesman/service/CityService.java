package com.tumile.salesman.service;

import com.tumile.salesman.service.dto.response.CityRes;
import com.tumile.salesman.service.dto.response.CitySimpleRes;
import com.tumile.salesman.service.dto.response.FlightRes;

import java.util.List;

public interface CityService {

    CityRes handleGet(Long id);

    List<CitySimpleRes> handleSearch(String query);

    List<FlightRes> handleGetFlights(Long id1, Long id2);
}
