package com.example.workflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CartItemResposeDTO {
    private String userId;
    private List<CartResponseDTO> cartItems; // ✅ Đ
    private double totalCartPrice;
}
