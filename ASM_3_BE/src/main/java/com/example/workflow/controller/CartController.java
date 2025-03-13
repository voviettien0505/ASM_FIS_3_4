package com.example.workflow.controller;

import com.example.workflow.dto.request.CreateCartRequest;
import com.example.workflow.dto.response.CartItemResposeDTO;
import com.example.workflow.model.CartItem;
import com.example.workflow.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestBody CreateCartRequest request) {
        CartItem cartItem = cartService.addToCart(request);
        return ResponseEntity.ok(cartItem);
    }
    @GetMapping("/{userId}")
    public ResponseEntity<?> getCart(@PathVariable("userId") String userId) {
        try {
            CartItemResposeDTO cartResponse = cartService.getCartByUserId(userId);
            return ResponseEntity.ok(cartResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }


}
