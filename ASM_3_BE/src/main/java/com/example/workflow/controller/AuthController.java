package com.example.workflow.controller;

import com.example.workflow.dto.request.LoginRequest;
import com.example.workflow.dto.request.RegisterRequest;
import com.example.workflow.model.User;
import com.example.workflow.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User loggedInUser = authService.login(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(loggedInUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

        @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
            try {
                User newUser = authService.register(request);
                return ResponseEntity.ok(newUser);
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }


}
