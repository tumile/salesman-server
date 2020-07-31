package com.tumile.salesman.service.job;

import com.tumile.salesman.service.CustomerService;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

@Component
public class ExpireCustomerJob extends QuartzJobBean {

    public static final String GROUP_NAME = "EXPIRE_CUSTOMER";

    private final CustomerService customerService;

    public ExpireCustomerJob(CustomerService customerService) {
        this.customerService = customerService;
    }

    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) {
        JobDataMap jobDataMap = jobExecutionContext.getMergedJobDataMap();
        Long playerId = jobDataMap.getLong("playerId");
        Long customerId = jobDataMap.getLong("customerId");
        customerService.expireCustomer(playerId, customerId);
    }
}
