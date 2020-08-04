package com.tumile.salesman.service.job;

import com.tumile.salesman.service.PlayerService;
import lombok.SneakyThrows;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

@Component
public class AddCustomerJob extends QuartzJobBean {

    public static final Long TIME_MILLIS = 3600000L;

    private final PlayerService playerService;

    public AddCustomerJob(PlayerService playerService) {
        this.playerService = playerService;
    }

    public static String buildGroupName(Long playerId) {
        return "ADD_CUSTOMER_" + playerId;
    }

    @SneakyThrows
    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) {
        JobDataMap jobDataMap = jobExecutionContext.getMergedJobDataMap();
        Long playerId = jobDataMap.getLong("playerId");
        playerService.addCustomerAndRescheduleJob(playerId, jobExecutionContext.getJobDetail(),
            jobExecutionContext.getTrigger());

        System.out.println("ADDING CUSTOMER FOR PLAYER " + playerId);
    }
}
