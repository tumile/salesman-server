package com.tumile.salesman.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Data
public class Airline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 30)
    @Column(length = 30, nullable = false)
    private String name;

    @NotNull
    @Size(max = 100)
    @Column(length = 100, nullable = false)
    private String image;

    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull
    @JoinColumn(name = "city_id", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private City city;
}
