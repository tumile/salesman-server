package com.tumile.salesman.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfiguration {

    @Bean
    public CorsFilter corsFilter(@Value("${security.cors.allowed-origins}") String allowedOrigins,
                                 @Value("${security.cors.allowed-methods}") String allowedMethods,
                                 @Value("${security.cors.allowed-headers}") String allowedHeaders,
                                 @Value("${security.cors.exposed-headers}") String exposedHeaders,
                                 @Value("${security.cors.allow-credentials}") Boolean allowCredentials,
                                 @Value("${security.cors.max-age}") Long maxAge) {
        org.springframework.web.cors.CorsConfiguration config = new org.springframework.web.cors.CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        config.setAllowedMethods(Arrays.asList(allowedMethods.split(",")));
        config.setAllowedHeaders(Arrays.asList(allowedHeaders.split(",")));
        config.setExposedHeaders(Arrays.asList(exposedHeaders.split(",")));
        config.setAllowCredentials(allowCredentials);
        config.setMaxAge(maxAge);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}
