package com.tumile.salesman.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Pattern(regexp = "^[_.@A-Za-z0-9-]+$")
    @Size(min = 2, max = 20)
    @Column(length = 20, unique = true, nullable = false)
    private String username;

    @JsonIgnore
    @NotNull
    @Size(min = 60, max = 60)
    @Column(length = 60, nullable = false)
    private String password;

    @NotNull
    @Size(max = 100)
    @Column(length = 100, nullable = false)
    private String image;

    @NotNull
    @Column(nullable = false)
    private Double money;

    @NotNull
    @Column(nullable = false)
    private Integer stamina;

    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @OneToMany(mappedBy = "player")
    private Set<Achievement> achievements = new HashSet<>();
}
