package com.tumile.salesman.service;

import com.tumile.salesman.api.error.NotFoundException;
import com.tumile.salesman.domain.Airline;
import com.tumile.salesman.domain.City;
import com.tumile.salesman.domain.FlightInfo;
import com.tumile.salesman.repository.CityRepository;
import com.tumile.salesman.repository.FlightInfoRepository;
import com.tumile.salesman.service.dto.response.CityRes;
import com.tumile.salesman.service.dto.response.CitySimpleRes;
import com.tumile.salesman.service.dto.response.FlightRes;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CityService {

    private final CityRepository cityRepository;
    private final FlightInfoRepository flightInfoRepository;

    public CityService(CityRepository cityRepository, FlightInfoRepository flightInfoRepository) {
        this.cityRepository = cityRepository;
        this.flightInfoRepository = flightInfoRepository;
    }

    public CityRes getById(Long id) {
        City city = cityRepository.findById(id).orElseThrow(() -> new NotFoundException("City not found"));
        return CityRes.fromCity(city);
    }

    public List<CitySimpleRes> search(String query) {
        if (query.isBlank()) {
            return Collections.emptyList();
        }
        return cityRepository.findAllByNameStartsWith(query).stream().map(CitySimpleRes::fromCity)
            .collect(Collectors.toList());
    }

    public List<FlightRes> getFlights(Long city1Id, Long city2Id) {
        City city1 = cityRepository.findById(city1Id).orElseThrow(() -> new NotFoundException("First city not found"));
        City city2 = cityRepository.findById(city2Id).orElseThrow(() -> new NotFoundException("Second city not found"));

        var id = new FlightInfo.FlightInfoId();
        id.setFromCityId(Math.min(city1Id, city2Id));
        id.setToCityId(Math.max(city1Id, city2Id));
        FlightInfo info = flightInfoRepository.findById(id).orElseThrow(() -> new NotFoundException("Info not found"));
        double basePrice = Math.round(50 + info.getDistance() / 1609 * 0.11);

        List<FlightRes> flights = new ArrayList<>();
        for (Airline airline : city1.getAirlines()) {
            flights.add(FlightRes.fromAirline(airline, basePrice + Math.round(Math.random() * 100)));
        }
        for (Airline airline : city2.getAirlines()) {
            boolean exists = false;
            for (FlightRes flight : flights) {
                if (flight.getAirline().equals(airline.getName())) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                flights.add(FlightRes.fromAirline(airline, basePrice + Math.round(Math.random() * 100)));
            }
        }
        flights.sort(Comparator.comparing(FlightRes::getPrice));
        return flights;
    }
}
