package com.tumile.salesman.service.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
public class SellReq {

    @NotNull
    private Double price;

    private Long customerId;
}
