package com.tumile.salesman.service.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
public class RegisterReq {

    @NotBlank(message = "Username cannot be blank")
    @Pattern(regexp = "^[_.@A-Za-z0-9-]+$", message = "Username contains invalid characters")
    @Size(min = 2, max = 20, message = "Username is too short or too long")
    private String username;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "Password is too short")
    private String password;

    private MultipartFile image;

    private boolean rememberMe;
}
