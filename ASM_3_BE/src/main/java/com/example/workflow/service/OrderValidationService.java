package com.example.workflow.service;

import com.example.workflow.dto.request.CreateOrderDetailRequest;
import com.example.workflow.dto.request.CreateOrderRequest;
import com.example.workflow.model.Product;
import com.example.workflow.repository.ProductRepository;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service("orderValidationService")
public class OrderValidationService implements JavaDelegate {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void execute(DelegateExecution execution) {
        // 🛠 Lấy CreateOrderRequest từ biến Camunda
        CreateOrderRequest orderRequest = (CreateOrderRequest) execution.getVariable("orderRequest");
        if (orderRequest == null) {
            execution.setVariable("approved", false);
            execution.setVariable("errorMessage", "Order request is null");
            return;
        }

        // 🛠 Kiểm tra số lượng sản phẩm
        boolean approved = true;
        for (CreateOrderDetailRequest detailDto : orderRequest.getOrderDetails()) {
            Optional<Product> productOpt = productRepository.findById(detailDto.getProductId());
            if (productOpt.isEmpty()) {
                approved = false;
                execution.setVariable("errorMessage", "Product not found with ID: " + detailDto.getProductId());
                break;
            }
            Product product = productOpt.get();
            if (detailDto.getQuantity() > product.getQuantity()) {
                approved = false;
                execution.setVariable("errorMessage", "Insufficient stock for product ID: " + detailDto.getProductId());
                break;
            }
        }

        // 🛠 Đặt biến approved vào Camunda
        execution.setVariable("approved", approved);
    }
}