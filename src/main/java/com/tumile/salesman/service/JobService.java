package com.tumile.salesman.service;

import com.tumile.salesman.domain.Player;
import org.quartz.JobExecutionContext;
import org.quartz.SchedulerException;

public interface JobService {

    void addCustomerAndScheduleExpire(Player player);

    void updateJobsAsTimePassed(Player player, long timePassedMillis);

    void scheduleAddCustomer(Long playerId, long timeMillis);

    void scheduleExpireCustomer(Long playerId, Long customerId, long timeMillis);

    void executeAddCustomer(JobExecutionContext context) throws SchedulerException;

    void executeExpireCustomer(JobExecutionContext context) throws SchedulerException;
}
