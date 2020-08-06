package com.tumile.salesman.service.s3;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
public class S3Service {

    private final AmazonS3 s3Client;
    private final String bucket;

    public S3Service(AmazonS3 s3Client, @Value("${AWS_S3_BUCKET}") String bucket) {
        this.s3Client = s3Client;
        this.bucket = bucket;
    }

    public String upload(MultipartFile multipartFile, String name) {
        try (InputStream inputStream = new ByteArrayInputStream(multipartFile.getBytes())) {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(multipartFile.getContentType());
            PutObjectRequest request = new PutObjectRequest(bucket, name, inputStream, metadata)
                .withCannedAcl(CannedAccessControlList.PublicRead);
            s3Client.putObject(request);
            return s3Client.getUrl(bucket, name).toString();
        } catch (AmazonServiceException | IOException ex) {
            throw new IllegalStateException(ex.getMessage());
        }
    }
}
