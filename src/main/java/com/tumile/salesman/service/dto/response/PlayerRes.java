package com.tumile.salesman.service.dto.response;

import com.tumile.salesman.domain.Player;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlayerRes {

    private Long id;

    private String username;

    private String image;

    private Double money;

    private Integer stamina;

    private CitySimpleRes city;

    private List<AchievementRes> achievements;

    public static PlayerRes fromPlayer(Player player) {
        PlayerRes res = new PlayerRes();
        res.setId(player.getId());
        res.setUsername(player.getUsername());
        res.setImage(player.getImage());
        res.setMoney(player.getMoney());
        res.setStamina(player.getStamina());
        res.setCity(CitySimpleRes.fromCity(player.getCity()));
        res.setAchievements(player.getAchievements().stream().map(AchievementRes::fromAchievement)
            .collect(Collectors.toList()));
        return res;
    }
}
