package com.tumile.salesman.service.job;

import com.tumile.salesman.domain.Airfare;
import com.tumile.salesman.domain.Airline;
import com.tumile.salesman.domain.City;
import com.tumile.salesman.domain.Course;
import com.tumile.salesman.repository.AirfareRepository;
import com.tumile.salesman.repository.CityRepository;
import com.tumile.salesman.repository.CourseRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.LinkedList;
import java.util.List;

@Component
public class UpdateFareCronJob {

    private final AirfareRepository airfareRepository;
    private final CityRepository cityRepository;
    private final CourseRepository courseRepository;

    public UpdateFareCronJob(AirfareRepository airfareRepository, CityRepository cityRepository,
                             CourseRepository courseRepository) {
        this.airfareRepository = airfareRepository;
        this.cityRepository = cityRepository;
        this.courseRepository = courseRepository;
    }

//    @Override
//    public void run(String... args) {
//        updateFare();
//    }

    @Scheduled(cron = "0 0 0 * * *")
    public void updateFare() {
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
            System.out.println(basePrice);
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
