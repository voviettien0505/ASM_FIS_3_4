package com.example.workflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CartResponseDTO {
    private String productId;
    private String productName;
    private double price;
    private int quantity;
    private double totalPrice;
    private String image;
}
