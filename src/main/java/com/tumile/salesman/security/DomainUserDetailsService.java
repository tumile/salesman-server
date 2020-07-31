package com.tumile.salesman.security;

import com.tumile.salesman.repository.PlayerRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class DomainUserDetailsService implements UserDetailsService {

    private final PlayerRepository playerRepository;

    public DomainUserDetailsService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        return playerRepository.findOneByUsername(username)
                .map(user -> new User(user.getId().toString(), user.getPassword(), Collections.emptyList()))
                .orElseThrow(() -> new UsernameNotFoundException("Username not found"));
    }
}
