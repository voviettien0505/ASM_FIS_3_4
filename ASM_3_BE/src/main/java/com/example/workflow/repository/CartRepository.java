package com.example.workflow.repository;

import com.example.workflow.model.CartItem;
import com.example.workflow.model.Product;
import com.example.workflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<CartItem,String>  {
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    List<CartItem> findByUser(User user);
    void deleteByUser(User user); // ✅ Xóa toàn bộ giỏ hàng của user
}
