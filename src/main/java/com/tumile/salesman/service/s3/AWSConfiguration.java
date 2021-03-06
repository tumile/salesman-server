package com.tumile.salesman.service.s3;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AWSConfiguration {

    @Bean
    public AmazonS3 amazonS3(@Value("${AWS_ACCESS_KEY_ID}") String accessKeyId,
                             @Value("${AWS_SECRET_ACCESS_KEY}") String secretAccessKey,
                             @Value("${AWS_REGION}") String region) {
        BasicAWSCredentials basicAWSCredentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);
        return AmazonS3ClientBuilder.standard().withRegion(Regions.fromName(region))
            .withCredentials(new AWSStaticCredentialsProvider(basicAWSCredentials)).build();
    }
}
