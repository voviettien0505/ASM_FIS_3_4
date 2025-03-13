package com.example.workflow.controller;

import com.example.workflow.dto.request.CreateOrderRequest;
import com.example.workflow.dto.response.OrderResponseDTO;
import com.example.workflow.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/add")
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody CreateOrderRequest request) {
        OrderResponseDTO orderResponse = orderService.createOrder(request);
        return ResponseEntity.ok(orderResponse);
    }

    @GetMapping("/user/{userId}")
    public List<OrderResponseDTO> getOrdersByUser(@PathVariable String userId) {
        return orderService.getOrdersByUser(userId);
    }
    // Danh sách đơn hàng trong admin
    @GetMapping("/all/admin")
    public List<OrderResponseDTO> getAllOrders() {
        return orderService.getAllOrdersWithUser();
    }

    // Cập nhật thành đã xác nhận trong admin
    @PutMapping("/{orderId}/confirm/admin")
    public ResponseEntity<String> OrderConfirmed(@PathVariable String orderId) {
        String responseMessage = orderService.OrderConfirmed(orderId);
        return ResponseEntity.ok(responseMessage);
    }


}
