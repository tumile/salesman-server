package com.tumile.salesman.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.Instant;
import java.util.Date;

@Entity
@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(length = 50, nullable = false)
    private String name;

    @NotNull
    @Size(max = 100)
    @Column(length = 100, nullable = false)
    private String image;

    @NotNull
    @Size(max = 250)
    @Column(length = 250, nullable = false)
    private String message;

    @NotNull
    @Column(nullable = false)
    private Double price;

    private Date expireAt;

    @NotNull
    @Column(nullable = false)
    private Boolean isExpired = false;

    @OneToOne(fetch = FetchType.LAZY)
    @NotNull
    @JoinColumn(name = "city_id", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private City city;

    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull
    @JoinColumn(name = "player_id", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Player player;
}
