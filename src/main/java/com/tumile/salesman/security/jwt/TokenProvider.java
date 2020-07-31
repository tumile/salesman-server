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
    private final long tokenValidity;
    private final long tokenValidityRemember;

    public TokenProvider(@Value("${security.jwt.secret}") String secret,
                         @Value("${security.jwt.token-validity}") long tokenValidity,
                         @Value("${security.jwt.token-validity-remember-me}") long tokenValidityRemember) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.tokenValidity = tokenValidity;
        this.tokenValidityRemember = tokenValidityRemember;
    }

    public String createToken(Authentication authentication, boolean rememberMe) {
        long now = (new Date()).getTime();
        Date validity;
        if (!rememberMe) {
            validity = new Date(now + this.tokenValidity);
        } else {
            validity = new Date(now + this.tokenValidityRemember);
        }
        return Jwts.builder()
                .setSubject(authentication.getName())
                .signWith(key, SignatureAlgorithm.HS512)
                .setExpiration(validity)
                .compact();
    }

    public String createToken(String player, boolean rememberMe) {
        long now = (new Date()).getTime();
        Date validity;
        if (!rememberMe) {
            validity = new Date(now + this.tokenValidity);
        } else {
            validity = new Date(now + this.tokenValidityRemember);
        }
        return Jwts.builder()
                .setSubject(player)
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
