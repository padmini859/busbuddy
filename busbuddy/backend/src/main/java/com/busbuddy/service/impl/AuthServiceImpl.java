package com.busbuddy.service.impl;

import com.busbuddy.dto.request.LoginRequest;
import com.busbuddy.dto.response.LoginResponse;
import com.busbuddy.entity.AdminUser;
import com.busbuddy.exception.BadRequestException;
import com.busbuddy.repository.AdminUserRepository;
import com.busbuddy.security.JwtTokenProvider;
import com.busbuddy.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AdminUserRepository adminUserRepository;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           JwtTokenProvider tokenProvider,
                           AdminUserRepository adminUserRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.adminUserRepository = adminUserRepository;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        AdminUser admin = adminUserRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("User profile not found"));

        return new LoginResponse(jwt, admin.getUsername(), admin.getRole());
    }
}
