package com.tumile.salesman.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@Entity
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(length = 50, nullable = false)
    private String title;

    @NotNull
    @Size(max = 10)
    @Column(length = 10, nullable = false)
    private String tag;

    @NotNull
    @Size(max = 100)
    @Column(length = 100, nullable = false)
    private String icon;

    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;
}
