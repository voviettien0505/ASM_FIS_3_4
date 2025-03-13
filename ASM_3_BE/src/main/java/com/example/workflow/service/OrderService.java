package com.example.workflow.service;

import com.example.workflow.dto.request.CreateOrderRequest;
import com.example.workflow.dto.response.OrderDetailResponseDTO;
import com.example.workflow.dto.response.OrderResponseDTO;
import com.example.workflow.model.Order;
import com.example.workflow.model.OrderDetail;
import com.example.workflow.model.User;
import com.example.workflow.model.Product;
import com.example.workflow.repository.*;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private RuntimeService runtimeService;

    @Transactional
    public OrderResponseDTO createOrder(CreateOrderRequest request) {
        // Khởi tạo quy trình Camunda
        Map<String, Object> variables = new HashMap<>();
        variables.put("orderRequest", request);
        ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("ASM_3_cammunda-process", variables);

        // Lấy kết quả từ Camunda
        Map<String, Object> processVariables = runtimeService.getVariables(processInstance.getId());
        Boolean approved = (Boolean) processVariables.getOrDefault("approved", false);

        if (!approved) {
            String errorMessage = (String) processVariables.getOrDefault("errorMessage", "Order creation failed due to insufficient stock");
            throw new RuntimeException(errorMessage);
        }

        //  Nếu approved, tạo đơn hàng như cũ
        return createOrderInternal(request);
    }

    @Transactional
    public OrderResponseDTO createOrderInternal(CreateOrderRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUserId()));

        Order order = new Order();
        order.setDate(LocalDateTime.now());
        order.setFullName(request.getFullName());
        order.setPhone(request.getPhone());
        order.setStatus(request.getStatus());
        order.setTotalAmount(request.getTotalAmount());
        order.setUser(user);

        Order savedOrder = orderRepository.save(order);

        List<OrderDetail> orderDetails = request.getOrderDetails().stream().map(detailDto -> {
            Product product = productRepository.findById(detailDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + detailDto.getProductId()));

            product.setQuantity(product.getQuantity() - detailDto.getQuantity());
            productRepository.save(product);

            OrderDetail detail = new OrderDetail();
            detail.setPrice(detailDto.getPrice());
            detail.setQuantity(detailDto.getQuantity());
            detail.setOrder(savedOrder);
            detail.setProduct(product);
            return detail;
        }).collect(Collectors.toList());

        orderDetailRepository.saveAll(orderDetails);
        cartRepository.deleteByUser(user);

        return new OrderResponseDTO(
                savedOrder.getId(),
                savedOrder.getDate(),
                savedOrder.getStatus(),
                savedOrder.getTotalAmount(),
                orderDetails.stream().map(detail -> new OrderDetailResponseDTO(
                        detail.getProduct().getId(),
                        detail.getProduct().getName(),
                        detail.getProduct().getImage(),
                        detail.getPrice(),
                        detail.getQuantity()
                )).collect(Collectors.toList())
        );
    }

    public List<OrderResponseDTO> getOrdersByUser(String userId) {
        List<Order> orders = orderRepository.findByUserId(userId);

        return orders.stream().map(order -> new OrderResponseDTO(
                order.getId().toString(),
                order.getDate(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getOrderDetails().stream().map(detail -> new OrderDetailResponseDTO(
                        detail.getProduct().getId().toString(),
                        detail.getProduct().getName(),
                        detail.getProduct().getImage(),
                        detail.getPrice(),
                        detail.getQuantity()
                )).collect(Collectors.toList())
        )).collect(Collectors.toList());
    }


    public List<OrderResponseDTO> getAllOrdersWithUser() {
        List<Order> orders = orderRepository.findAll();

        return orders.stream().map(order -> new OrderResponseDTO(
                order.getId(),
                order.getDate(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getUser() != null ? order.getUser().getFullName() : "Unknown",
                order.getUser() != null ? order.getUser().getPhone() : "Unknown",
                order.getOrderDetails().stream().map(detail -> new OrderDetailResponseDTO(
                        detail.getProduct().getId(),
                        detail.getProduct().getName(),
                        detail.getProduct().getImage(),
                        detail.getPrice(),
                        detail.getQuantity()
                )).collect(Collectors.toList())
        )).collect(Collectors.toList());
    }

    @Transactional
    public String OrderConfirmed(String orderId) {
        String currentStatusRequired = "DA_DAT_HANG"; // Chỉ cho phép cập nhật nếu trạng thái hiện tại là DA_DAT_HANG
        String newStatus = "DA_XAC_NHAN"; // Trạng thái sau khi cập nhật

        // 🛠 Tìm đơn hàng
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        //  Kiểm tra trạng thái hiện tại
        if (!order.getStatus().equals(currentStatusRequired)) {
            throw new IllegalStateException("Order can only be confirmed if it is in status: " + currentStatusRequired);
        }

        // ✅ Cập nhật trạng thái
        order.setStatus(newStatus);
        orderRepository.save(order);

        return "Order " + orderId + " has been confirmed successfully.";
    }






}