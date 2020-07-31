package com.tumile.salesman.api.error;

public class UsernameUsedException extends RuntimeException {

    public UsernameUsedException() {
        super("Username already taken");
    }
}
