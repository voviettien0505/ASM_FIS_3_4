package com.example.workflow.config;

import com.example.workflow.model.User;
import com.example.workflow.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class ApplicationInitConfig {

    private final UserRepository userRepository;

    public ApplicationInitConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void initAdminAccount() {
        // Kiểm tra xem user "admin" đã tồn tại chưa
        Optional<User> adminUser = userRepository.findByUsername("admin");

        if (adminUser.isEmpty()) {
            User user = new User();
            user.setUsername("admin");
            user.setPassword("123"); // TODO: Nên mã hóa password sau này
            user.setEmail("admin@example.com");
            user.setFullName("Administrator");
            user.setPhone("0123456789");
            user.setRole("ADMIN");
            userRepository.save(user);
            System.out.println("Tài khoản admin đã được tạo!");
        }
    }
}
