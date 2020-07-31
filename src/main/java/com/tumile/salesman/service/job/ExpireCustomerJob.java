package com.tumile.salesman.service.job;

import com.tumile.salesman.service.PlayerService;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

@Component
public class ExpireCustomerJob extends QuartzJobBean {

    public static final String GROUP_NAME = "EXPIRE_CUSTOMER";

    private final PlayerService playerService;

    public ExpireCustomerJob(PlayerService playerService) {
        this.playerService = playerService;
    }

    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) {
        JobDataMap jobDataMap = jobExecutionContext.getMergedJobDataMap();
        Long playerId = jobDataMap.getLong("playerId");
        Long customerId = jobDataMap.getLong("customerId");
        playerService.expireCustomer(playerId, customerId);
    }
}
