package com.tumile.salesman.service.dto.response;

import com.tumile.salesman.domain.Achievement;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AchievementRes {

    private Long id;

    private String title;

    private String icon;

    public static AchievementRes fromAchievement(Achievement achievement) {
        AchievementRes res = new AchievementRes();
        res.setId(achievement.getId());
        res.setTitle(achievement.getTitle());
        res.setIcon(achievement.getIcon());
        return res;
    }
}
