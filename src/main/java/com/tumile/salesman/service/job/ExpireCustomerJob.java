package com.tumile.salesman.service.job;

import com.tumile.salesman.service.PlayerService;
import lombok.SneakyThrows;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

@Component
public class ExpireCustomerJob extends QuartzJobBean {

    public static final Long TIME_MILLIS = 3600000L;

    private final PlayerService playerService;

    public ExpireCustomerJob(PlayerService playerService) {
        this.playerService = playerService;
    }

    public static String buildGroupName(Long playerId) {
        return "EXPIRE_CUSTOMER_" + playerId;
    }

    public static String buildGroupName(Long playerId, Long customerId) {
        return "EXPIRE_CUSTOMER_" + playerId + "_" + customerId;
    }

    @SneakyThrows
    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) {
        JobDataMap jobDataMap = jobExecutionContext.getMergedJobDataMap();
        Long customerId = jobDataMap.getLong("customerId");
        playerService.expireCustomerAndDeleteJob(customerId, jobExecutionContext.getJobDetail().getKey());

        System.out.println("EXPIRING CUSTOMER " + customerId);
    }
}
