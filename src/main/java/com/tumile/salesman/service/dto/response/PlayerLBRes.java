package com.tumile.salesman.service.dto.response;

import com.tumile.salesman.domain.Player;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PlayerLBRes {

    private Long id;

    private String username;

    private String image;

    private Double money;

    public static PlayerLBRes fromPlayer(Player player) {
        PlayerLBRes res = new PlayerLBRes();
        res.setId(player.getId());
        res.setUsername(player.getUsername());
        res.setImage(player.getImage());
        res.setMoney(player.getMoney());
        return res;
    }
}
