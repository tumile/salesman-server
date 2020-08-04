package com.tumile.salesman.service.impl;

import com.tumile.salesman.api.error.NotFoundException;
import com.tumile.salesman.domain.Airline;
import com.tumile.salesman.domain.City;
import com.tumile.salesman.domain.FlightInfo;
import com.tumile.salesman.repository.CityRepository;
import com.tumile.salesman.repository.FlightInfoRepository;
import com.tumile.salesman.repository.PlayerRepository;
import com.tumile.salesman.service.CityService;
import com.tumile.salesman.service.dto.response.CityRes;
import com.tumile.salesman.service.dto.response.CitySimpleRes;
import com.tumile.salesman.service.dto.response.FlightRes;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CityServiceImpl implements CityService {

    private final CityRepository cityRepository;
    private final FlightInfoRepository flightInfoRepository;
    private final PlayerRepository playerRepository;

    public CityServiceImpl(CityRepository cityRepository, FlightInfoRepository flightInfoRepository,
                           PlayerRepository playerRepository) {
        this.cityRepository = cityRepository;
        this.flightInfoRepository = flightInfoRepository;
        this.playerRepository = playerRepository;
    }

    @Override
    public CityRes handleGet(Long id) {
        return cityRepository.findById(id)
            .map(CityRes::fromCity)
            .orElseThrow(() -> new NotFoundException("City not found"));
    }

    @Override
    public List<CitySimpleRes> handleSearch(String query) {
        if (query.isBlank()) {
            return Collections.emptyList();
        }
        Long playerId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        Long cityId = playerRepository.findById(playerId)
            .orElseThrow(() -> new NotFoundException("Player not found"))
            .getCity().getId();
        return cityRepository.findAllByNameStartsWithAndIdIsNot(query, cityId).stream().map(CitySimpleRes::fromCity)
            .collect(Collectors.toList());
    }

    @Override
    public List<FlightRes> handleGetFlights(Long id1, Long id2) {
        City city1 = cityRepository.findById(id1).orElseThrow(() -> new NotFoundException("First city not found"));
        City city2 = cityRepository.findById(id2).orElseThrow(() -> new NotFoundException("Second city not found"));

        var id = new FlightInfo.FlightInfoId();
        id.setFromCityId(Math.min(id1, id2));
        id.setToCityId(Math.max(id1, id2));
        FlightInfo info = flightInfoRepository.findById(id).orElseThrow(() -> new NotFoundException("Info not found"));
        double basePrice = Math.round(50 + info.getDistance() / 1609 * 0.11);
        double duration = info.getDuration();

        List<FlightRes> flights = new ArrayList<>();
        for (Airline airline : city1.getAirlines()) {
            flights.add(FlightRes.fromAirline(airline, basePrice + Math.round(Math.random() * 100), duration));
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
                flights.add(FlightRes.fromAirline(airline, basePrice + Math.round(Math.random() * 100), duration));
            }
        }
        flights.sort(Comparator.comparing(FlightRes::getPrice));
        return flights;
    }
}
