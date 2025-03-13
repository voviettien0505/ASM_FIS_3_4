package com.example.workflow.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderDetailResponseDTO {
    private String productId;
    private String productName;
    private String productImage;
    private BigDecimal price;
    private Integer quantity;

    public OrderDetailResponseDTO(String productId, String productName, String productImage, BigDecimal price, Integer quantity) {
        this.productId = productId;
        this.productName = productName;
        this.productImage = productImage;
        this.price = price;
        this.quantity = quantity;
    }
}
