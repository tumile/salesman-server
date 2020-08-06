package com.tumile.salesman.service.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
public class SellReq {

    private Long customerId;

    private Integer stamina = 0;

    @NotNull
    private Double price;
}
