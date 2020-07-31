package com.tumile.salesman.service.job;

import com.tumile.salesman.service.PlayerService;
import lombok.SneakyThrows;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

@Component
public class AddCustomerJob extends QuartzJobBean {

    public static final String GROUP_NAME = "ADD_CUSTOMER";

    private final PlayerService playerService;

    public AddCustomerJob(PlayerService playerService) {
        this.playerService = playerService;
    }

    @SneakyThrows
    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) {
        JobDataMap jobDataMap = jobExecutionContext.getMergedJobDataMap();
        Long playerId = jobDataMap.getLong("playerId");
        playerService.addCustomer(playerId);
        playerService.scheduleAddCustomer(playerId, 3600000L);
    }
}
