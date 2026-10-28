package com.busbuddy.service;

import com.busbuddy.dto.request.LoginRequest;
import com.busbuddy.dto.response.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}
