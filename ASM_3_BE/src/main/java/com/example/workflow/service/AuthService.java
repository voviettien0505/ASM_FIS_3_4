package com.example.workflow.service;

import com.example.workflow.dto.request.RegisterRequest;
import com.example.workflow.enums.Role;
import com.example.workflow.model.User;
import com.example.workflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public User login(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user.get();
        }
        throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không đúng");
    }

    public User register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(request.getPassword());
        newUser.setFullName(request.getFullName());
        newUser.setPhone(request.getPhone());
        newUser.setRole(Role.USER.name()); // Lưu role là "USER"

        return userRepository.save(newUser);
    }

}
