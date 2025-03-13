package com.example.workflow.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CreateOrderRequest {

    private String userId;
    private String fullName;
    private String phone;
    private String status;
    private BigDecimal totalAmount;
    private LocalDateTime date;
    private List<CreateOrderDetailRequest> orderDetails; // ✅ Danh
}
