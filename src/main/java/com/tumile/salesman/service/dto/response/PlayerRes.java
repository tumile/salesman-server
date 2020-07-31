package com.tumile.salesman.service.dto.response;

import com.tumile.salesman.domain.Player;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlayerRes {

    private Long id;

    private String username;

    private String image;

    private Double money;

    private Integer stamina;

    private CityNameRes city;

    public static PlayerRes fromPlayer(Player player) {
        PlayerRes res = new PlayerRes();
        res.setId(player.getId());
        res.setUsername(player.getUsername());
        res.setImage(player.getImage());
        res.setMoney(player.getMoney());
        res.setStamina(player.getStamina());
        res.setCity(CityNameRes.fromCity(player.getCity()));
        return res;
    }
}
