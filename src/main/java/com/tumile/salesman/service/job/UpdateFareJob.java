package com.tumile.salesman.service.job;

import com.tumile.salesman.domain.Airfare;
import com.tumile.salesman.domain.Airline;
import com.tumile.salesman.domain.City;
import com.tumile.salesman.domain.Course;
import com.tumile.salesman.repository.AirfareRepository;
import com.tumile.salesman.repository.CityRepository;
import com.tumile.salesman.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.LinkedList;
import java.util.List;

@Component
public class UpdateFareJob implements CommandLineRunner {

    private final AirfareRepository airfareRepository;
    private final CityRepository cityRepository;
    private final CourseRepository courseRepository;

    public UpdateFareJob(AirfareRepository airfareRepository, CityRepository cityRepository,
                         CourseRepository courseRepository) {
        this.airfareRepository = airfareRepository;
        this.cityRepository = cityRepository;
        this.courseRepository = courseRepository;
    }

    @Transactional
    @Override
    public void run(String... args) {
        Iterable<Course> courses = courseRepository.findAll();
        for (Course course : courses) {
            City fromCity = cityRepository.findById(course.getId().getFromCityId()).orElseThrow();
            City toCity = cityRepository.findById(course.getId().getToCityId()).orElseThrow();
            List<Airline> airlines = new LinkedList<>(fromCity.getAirlines());
            for (Airline airline : toCity.getAirlines()) {
                boolean exists = false;
                for (Airline a : airlines) {
                    if (a.getId().equals(airline.getId())) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    airlines.add(airline);
                }
            }
            double basePrice = Math.round(50 + course.getDistance() / 1609 * 0.11);
            for (Airline airline : airlines) {
                var id = new Airfare.AirfareId();
                id.setFromCityId(fromCity.getId());
                id.setToCityId(toCity.getId());
                id.setAirlineId(airline.getId());
                Airfare airfare = new Airfare();
                airfare.setId(id);
                airfare.setPrice(basePrice + Math.round(Math.random() * 100));
                airfareRepository.save(airfare);
            }
        }
    }
}
