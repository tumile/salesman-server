package com.tumile.salesman.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
@Entity(name = "flight_info")
public class FlightInfo {

    @EmbeddedId
    private FlightInfoId id;

    private Double distance;

    private Double duration;

    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_city_id", nullable = false)
    private City fromCity;

    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_city_id", nullable = false)
    private City toCity;

    @Data
    @Embeddable
    public static class FlightInfoId implements Serializable {

        private Long fromCityId;

        private Long toCityId;
    }
}
