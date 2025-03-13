package com.example.workflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class OrderResponseDTO {
    private String orderId;
    private LocalDateTime date;
    private String status;
    private BigDecimal totalAmount;
    private String customerName;
    private String customerPhone;
    private List<OrderDetailResponseDTO> orderDetails;

    public OrderResponseDTO(String orderId, LocalDateTime date, String status, BigDecimal totalAmount, List<OrderDetailResponseDTO> orderDetails) {
        this.orderId = orderId;
        this.date = date;
        this.status = status;
        this.totalAmount = totalAmount;
        this.orderDetails = orderDetails;
    }
}
