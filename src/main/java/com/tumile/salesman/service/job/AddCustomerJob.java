package com.tumile.salesman.service.job;

import com.tumile.salesman.service.CustomerService;
import lombok.SneakyThrows;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

@Component
public class AddCustomerJob extends QuartzJobBean {

    public static final String GROUP_NAME = "ADD_CUSTOMER";

    private final CustomerService customerService;

    public AddCustomerJob(CustomerService customerService) {
        this.customerService = customerService;
    }

    @SneakyThrows
    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) {
        JobDataMap jobDataMap = jobExecutionContext.getMergedJobDataMap();
        Long playerId = jobDataMap.getLong("playerId");
        customerService.addCustomer(playerId, true);
    }
}
