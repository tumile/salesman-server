package com.tumile.salesman;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SalesmanApplication {

    public static void main(String[] args) {
        SpringApplication.run(SalesmanApplication.class, args);
    }
}
