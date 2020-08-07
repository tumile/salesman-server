package com.tumile.salesman.service.impl;

import com.tumile.salesman.api.error.NotFoundException;
import com.tumile.salesman.domain.Airfare;
import com.tumile.salesman.domain.Airline;
import com.tumile.salesman.domain.City;
import com.tumile.salesman.domain.Course;
import com.tumile.salesman.repository.AirfareRepository;
import com.tumile.salesman.repository.CityRepository;
import com.tumile.salesman.repository.CourseRepository;
import com.tumile.salesman.repository.PlayerRepository;
import com.tumile.salesman.service.CityService;
import com.tumile.salesman.service.Utils;
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
public class CityServiceImpl implements CityService {

    private final AirfareRepository airfareRepository;
    private final CityRepository cityRepository;
    private final CourseRepository courseRepository;
    private final PlayerRepository playerRepository;

    public CityServiceImpl(AirfareRepository airfareRepository, CityRepository cityRepository,
                           CourseRepository courseRepository, PlayerRepository playerRepository) {
        this.airfareRepository = airfareRepository;
        this.cityRepository = cityRepository;
        this.courseRepository = courseRepository;
        this.playerRepository = playerRepository;
    }

    @Override
    public CityRes handleGet(Long id) {
        return cityRepository.findById(id).map(CityRes::fromCity).
            orElseThrow(() -> new NotFoundException("City not found"));
    }

    @Override
    public List<CitySimpleRes> handleSearch(String query) {
        if (query.isBlank()) {
            return Collections.emptyList();
        }
        Long cityId = playerRepository.findById(Utils.getPlayerId())
            .orElseThrow(() -> new NotFoundException("Player not found"))
            .getCity().getId();
        return cityRepository.findAllByNameStartsWithAndIdIsNot(query, cityId)
            .stream()
            .map(CitySimpleRes::fromCity)
            .collect(Collectors.toList());
    }

    @Override
    public List<FlightRes> handleSearchFlights(Long cityId1, Long cityId2) {
        City city1 = cityRepository.findById(cityId1).orElseThrow(() -> new NotFoundException("City not found"));
        City city2 = cityRepository.findById(cityId2).orElseThrow(() -> new NotFoundException("City not found"));

        double duration = getFlightDuration(cityId1, cityId2);
        List<FlightRes> flights = new ArrayList<>();

        for (Airline airline : city1.getAirlines()) {
            double fare = getAirfare(cityId1, cityId2, airline.getId());
            flights.add(FlightRes.fromAirline(airline, fare, duration));
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
                double fare = getAirfare(cityId1, cityId2, airline.getId());
                flights.add(FlightRes.fromAirline(airline, fare, duration));
            }
        }
        flights.sort(Comparator.comparing(FlightRes::getPrice));
        return flights;
    }

    @Override
    public double getFlightDuration(Long cityId1, Long cityId2) {
        var id = new Course.CourseId();
        id.setFromCityId(Math.min(cityId1, cityId2));
        id.setToCityId(Math.max(cityId1, cityId2));
        return courseRepository.findById(id).orElseThrow(() -> new NotFoundException("Flight not found"))
            .getDuration();
    }

    @Override
    public double getAirfare(Long cityId1, Long cityId2, Long airlineId) {
        var id = new Airfare.AirfareId();
        id.setFromCityId(Math.min(cityId1, cityId2));
        id.setToCityId(Math.max(cityId1, cityId2));
        id.setAirlineId(airlineId);
        return airfareRepository.findById(id).orElseThrow(() -> new NotFoundException("Airline not found"))
            .getPrice();
    }
}
