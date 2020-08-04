package com.tumile.salesman.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Embeddable;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import java.io.Serializable;

@Data
@Entity(name = "flight_info")
public class FlightInfo {

    @EmbeddedId
    private FlightInfoId id;

    private Double distance;

    private Double duration;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class FlightInfoId implements Serializable {

        private Long fromCityId;

        private Long toCityId;
    }
}
