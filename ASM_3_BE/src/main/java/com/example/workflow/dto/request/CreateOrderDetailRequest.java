package com.example.workflow.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateOrderDetailRequest {

    private BigDecimal price;
    private Integer quantity;
    private String productId;

}
