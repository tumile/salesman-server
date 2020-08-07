package com.tumile.salesman.service.job;

import com.tumile.salesman.service.JobService;
import lombok.SneakyThrows;
import org.quartz.JobExecutionContext;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

@Component
public class ExpireCustomerJob extends QuartzJobBean {

    public static final Long TIME_MILLIS = 3600000L;

    private final JobService jobService;

    public ExpireCustomerJob(JobService jobService) {
        this.jobService = jobService;
    }

    public static String buildGroupName(Long playerId) {
        return "EXPIRE_CUSTOMER_" + playerId;
    }

    @SneakyThrows
    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) {
        jobService.executeExpireCustomer(jobExecutionContext);
    }
}
