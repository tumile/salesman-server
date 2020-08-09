package com.tumile.salesman.service.dto.response;

import com.tumile.salesman.domain.Mission;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MissionRes {

    private Long id;

    private String title;

    private String icon;

    private String description;

    private Integer progress;

    private Boolean finished;

    public static MissionRes fromMission(Mission mission) {
        MissionRes res = new MissionRes();
        res.setId(mission.getId());
        res.setTitle(mission.getTitle());
        res.setIcon(mission.getIcon());
        res.setDescription(mission.getDescription());
        res.setFinished(mission.getFinished());
        return res;
    }
}
