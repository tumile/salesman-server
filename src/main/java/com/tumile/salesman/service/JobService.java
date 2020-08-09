package com.tumile.salesman.service;

import org.quartz.JobExecutionContext;
import org.quartz.SchedulerException;

public interface JobService {

    void addCustomerAndScheduleExpire(Long playerId);

    void updateJobsAsTimePassed(Long playerId, long timePassedMillis);

    void scheduleAddCustomer(Long playerId, long timeMillis);

    void scheduleExpireCustomer(Long playerId, Long customerId, long timeMillis);

    void scheduleStaminaRegen(Long playerId);

    void executeAddCustomer(JobExecutionContext context) throws SchedulerException;

    void executeExpireCustomer(JobExecutionContext context) throws SchedulerException;

    void executeStaminaRegen(JobExecutionContext context) throws SchedulerException;
}
