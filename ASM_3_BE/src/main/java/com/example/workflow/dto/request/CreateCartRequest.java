package com.example.workflow.dto.request;

import lombok.Data;

@Data
public class CreateCartRequest {

    private String productId;
    private String userId;
    private Integer quantity;

}
