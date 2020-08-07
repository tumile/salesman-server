package com.tumile.salesman.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Collections;
import java.util.Date;

@Component
public class TokenProvider {

    private final Key key;
    private static final long TOKEN_VALIDITY = 86400000L;
    private static final long TOKEN_VALIDITY_REMEMBER = 2592000000L;

    public TokenProvider(@Value("${JWT_SECRET}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String createToken(Authentication authentication, boolean rememberMe) {
        long now = (new Date()).getTime();
        Date validity;
        if (!rememberMe) {
            validity = new Date(now + TOKEN_VALIDITY);
        } else {
            validity = new Date(now + TOKEN_VALIDITY_REMEMBER);
        }
        return Jwts.builder()
                .setSubject(authentication.getName())
                .signWith(key, SignatureAlgorithm.HS512)
                .setExpiration(validity)
                .compact();
    }

    public String createToken(Long playerId, boolean rememberMe) {
        long now = (new Date()).getTime();
        Date validity;
        if (!rememberMe) {
            validity = new Date(now + TOKEN_VALIDITY);
        } else {
            validity = new Date(now + TOKEN_VALIDITY_REMEMBER);
        }
        return Jwts.builder()
                .setSubject(playerId.toString())
                .signWith(key, SignatureAlgorithm.HS512)
                .setExpiration(validity)
                .compact();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        User principal = new User(claims.getSubject(), "", Collections.emptyList());
        return new UsernamePasswordAuthenticationToken(principal, token, null);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException ignored) {
            return false;
        }
    }
}
