package com.tumile.salesman.service.dto.response;

import com.tumile.salesman.domain.Player;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class PlayerLBRes {

    private Long id;

    private String username;

    private String image;

    private Double money;

    private List<AchievementRes> achievements;

    public static PlayerLBRes fromPlayer(Player player) {
        PlayerLBRes res = new PlayerLBRes();
        res.setId(player.getId());
        res.setUsername(player.getUsername());
        res.setImage(player.getImage());
        res.setMoney(player.getMoney());
        res.setAchievements(player.getAchievements().stream().map(AchievementRes::fromAchievement)
            .collect(Collectors.toList()));
        return res;
    }
}
