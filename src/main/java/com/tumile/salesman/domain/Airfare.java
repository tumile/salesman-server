package com.tumile.salesman.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
@Entity
public class Airfare {

    @EmbeddedId
    private AirfareId id;

    @NotNull
    @Column(nullable = false)
    private Double price;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class AirfareId implements Serializable {

        private Long fromCityId;

        private Long toCityId;

        private Long airlineId;
    }
}
