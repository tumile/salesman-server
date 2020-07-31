package com.tumile.salesman.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 20)
    @Column(length = 20, nullable = false)
    private String name;

    @NotNull
    @Size(max = 100)
    @Column(length = 100, nullable = false)
    private String image;

    @NotNull
    @Column(nullable = false)
    private Double latitude;

    @NotNull
    @Column(nullable = false)
    private Double longitude;

    @OneToMany(mappedBy = "city")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Airline> airlines = new HashSet<>();

    @OneToMany(mappedBy = "city")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<PointOfInterest> pointsOfInterest = new HashSet<>();
}
