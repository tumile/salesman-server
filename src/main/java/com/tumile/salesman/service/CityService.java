package com.tumile.salesman.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tumile.salesman.api.error.NotFoundException;
import com.tumile.salesman.domain.Airline;
import com.tumile.salesman.domain.City;
import com.tumile.salesman.repository.CityRepository;
import com.tumile.salesman.service.dto.response.CityNameRes;
import com.tumile.salesman.service.dto.response.CityRes;
import com.tumile.salesman.service.dto.response.FlightRes;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CityService {

    public static final Map<Pair<Long, Long>, Double> distances = new HashMap<>();
    private final String apiKey;
    private final CityRepository cityRepository;

    public CityService(@Value("${google.api-key}") String apiKey, CityRepository cityRepository) {
        this.apiKey = apiKey;
        this.cityRepository = cityRepository;
    }

    public CityRes get(Long id) {
        City city = cityRepository.findById(id).orElseThrow(() -> new NotFoundException("City not found"));
        return CityRes.fromCity(city);
    }

    public List<CityNameRes> search(String query) {
        if (query.isBlank()) {
            return Collections.emptyList();
        }
        return cityRepository.findAllByNameStartsWith(query).stream().map(CityNameRes::fromCity)
            .collect(Collectors.toList());
    }

    public List<FlightRes> getFlights(Long fromId, Long toId) {
        City from = cityRepository.findById(fromId).orElseThrow(() -> new NotFoundException("From city not found"));
        City to = cityRepository.findById(toId).orElseThrow(() -> new NotFoundException("To city not found"));
        double distance;
        if (distances.containsKey(Pair.of(fromId, toId))) {
            distance = distances.get(Pair.of(fromId, toId));
        } else if (distances.containsKey(Pair.of(toId, fromId))) {
            distance = distances.get(Pair.of(toId, fromId));
        } else {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + from.getName() +
                "&destinations=" + to.getName() + "&key=" + apiKey;
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            ObjectMapper mapper = new ObjectMapper();
            try {
                JsonNode root = mapper.readTree(response.getBody());
                distance = root.path("rows").get(0).path("elements").get(0).path("distance").path("value").asDouble();
            } catch (IOException | NullPointerException ex) {
                throw new IllegalStateException(ex.getMessage());
            }
            distances.put(Pair.of(fromId, toId), distance);
        }
        double basePrice = Math.round(50 + distance / 1609 * 0.11);
        List<FlightRes> flights = new ArrayList<>();
        for (Airline airline : to.getAirlines()) {
            flights.add(FlightRes.fromAirline(airline, basePrice + Math.round(Math.random() * 100)));
        }
        for (Airline airline : from.getAirlines()) {
            boolean exists = false;
            for (FlightRes flight : flights) {
                if (flight.getName().equals(airline.getName())) {
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
