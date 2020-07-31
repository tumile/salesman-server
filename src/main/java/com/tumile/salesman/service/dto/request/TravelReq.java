package com.tumile.salesman.service.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
public class TravelReq {

    @NotNull
    private Long fromCityId;

    @NotNull
    private Long toCityId;

    @NotNull
    private Long airlineId;

    @NotNull
    private Double price;
}
