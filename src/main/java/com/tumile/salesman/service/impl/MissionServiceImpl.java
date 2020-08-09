package com.tumile.salesman.service.impl;

import com.tumile.salesman.domain.Achievement;
import com.tumile.salesman.domain.Mission;
import com.tumile.salesman.domain.Player;
import com.tumile.salesman.repository.AchievementRepository;
import com.tumile.salesman.repository.MissionRepository;
import com.tumile.salesman.repository.PlayerRepository;
import com.tumile.salesman.service.MissionService;
import com.tumile.salesman.service.dto.response.MissionRes;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MissionServiceImpl implements MissionService {

    private final AchievementRepository achievementRepository;
    private final MissionRepository missionRepository;
    private final PlayerRepository playerRepository;

    public MissionServiceImpl(AchievementRepository achievementRepository, MissionRepository missionRepository,
                              PlayerRepository playerRepository) {
        this.achievementRepository = achievementRepository;
        this.missionRepository = missionRepository;
        this.playerRepository = playerRepository;
    }

    public void initMissions(Player player) {
        Mission moneyMission = new Mission();
        moneyMission.setTitle("Seasoned salesman");
        moneyMission.setTag("MONEY");
        moneyMission.setIcon("https://salesman-public.s3.amazonaws.com/medal-seasoned.png");
        moneyMission.setDescription("Reach 10k in total revenue");
        moneyMission.setProgress(1000.0);
        moneyMission.setPlayer(player);
        missionRepository.save(moneyMission);

        Mission visitMission = new Mission();
        visitMission.setTitle("Road warrior");
        visitMission.setTag("VISIT");
        visitMission.setIcon("https://salesman-public.s3.amazonaws.com/medal-road-warrior.png");
        visitMission.setDescription("Visit all cities");
        visitMission.setProgress(1.0);
        visitMission.setData("1");
        visitMission.setPlayer(player);
        missionRepository.save(visitMission);

        Achievement rankAchievement = new Achievement();
        rankAchievement.setTitle("Rookie salesman");
        rankAchievement.setTag("MONEY");
        rankAchievement.setIcon("https://salesman-public.s3.amazonaws.com/medal-rookie.png");
        rankAchievement.setPlayer(player);
        achievementRepository.save(rankAchievement);
    }

    @Override
    public List<MissionRes> getMissions(Long playerId) {
        return missionRepository.findAllByPlayerId(playerId).stream().map(mission -> {
            MissionRes res = MissionRes.fromMission(mission);
            if (!mission.getFinished()) {
                if (mission.getTag().equals("MONEY")) {
                    res.setProgress((int) (mission.getProgress() / 10000 * 100));
                } else if (mission.getTag().equals("VISIT")) {
                    res.setProgress((int) (mission.getProgress() / 22 * 100));
                }
            }
            return res;
        }).collect(Collectors.toList());
    }

    @Override
    public void updateMoneyMission(Long playerId, Double amount) {
        Mission mission = missionRepository.findByPlayerIdAndTitle(playerId, "Seasoned salesman");
        mission.setProgress(mission.getProgress() + amount);
        if (!mission.getFinished() && mission.getProgress() >= 10000) {
            mission.setFinished(true);
            Achievement achievement = achievementRepository.findByPlayerIdAndTag(playerId, "MONEY");
            achievement.setTitle("Seasoned salesman");
            achievement.setIcon("https://salesman-public.s3.amazonaws.com/medal-seasoned.png");
            achievementRepository.save(achievement);
        }
        missionRepository.save(mission);
    }

    @Override
    public void updateCityVisitMission(Long playerId, Long cityId) {
        Mission mission = missionRepository.findByPlayerIdAndTitle(playerId, "Road warrior");
        Set<Long> cityIds = Arrays.stream(mission.getData().split(","))
            .map(Long::parseLong)
            .collect(Collectors.toSet());
        if (cityIds.contains(cityId)) {
            return;
        }
        cityIds.add(cityId);
        mission.setProgress(mission.getProgress() + 1);
        mission.setData(cityIds.stream().map(Object::toString).collect(Collectors.joining(",")));
        if (!mission.getFinished() && mission.getProgress() >= 22) {
            mission.setFinished(true);
            Achievement achievement = new Achievement();
            achievement.setTitle("Road warrior");
            achievement.setTag("VISIT");
            achievement.setIcon("https://salesman-public.s3.amazonaws.com/medal-road-warrior.png");
            achievement.setPlayer(playerRepository.findById(playerId).orElseThrow());
            achievementRepository.save(achievement);
        }
        missionRepository.save(mission);
    }
}
