package com.example.workflow.service;

import com.example.workflow.dto.request.CreateCartRequest;
import com.example.workflow.dto.response.CartItemResposeDTO;
import com.example.workflow.dto.response.CartResponseDTO;
import com.example.workflow.model.CartItem;
import com.example.workflow.model.Product;
import com.example.workflow.model.User;
import com.example.workflow.repository.CartRepository;
import com.example.workflow.repository.ProductRepository;
import com.example.workflow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    public CartItem addToCart(CreateCartRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        Optional<CartItem> existingCartItem = cartRepository.findByUserAndProduct(user, product);
        if (existingCartItem.isPresent()) {
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
            return cartRepository.save(cartItem);
        }

        // Nếu chưa có, tạo mới
        CartItem newCartItem = new CartItem();
        newCartItem.setProduct(product);
        newCartItem.setUser(user);
        newCartItem.setQuantity(request.getQuantity());
        return cartRepository.save(newCartItem);
    }

    public CartItemResposeDTO getCartByUserId(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        List<CartItem> cartItems = cartRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            return new CartItemResposeDTO(userId, List.of(), 0.0);
        }

        List<CartResponseDTO> cartItemDTOList = cartItems.stream()
                .map(cartItem -> {
                    Product product = cartItem.getProduct();
                    double totalPrice = product.getPrice().doubleValue() * cartItem.getQuantity();
                    return new CartResponseDTO(
                            product.getId(),
                            product.getName(),
                            product.getPrice().doubleValue(),
                            cartItem.getQuantity(),
                            totalPrice,
                            product.getImage() // 🖼️ Thêm ảnh từ Product
                    );
                })
                .collect(Collectors.toList());

        double totalCartPrice = cartItemDTOList.stream()
                .mapToDouble(CartResponseDTO::getTotalPrice)
                .sum();

        return new CartItemResposeDTO(userId, cartItemDTOList, totalCartPrice);
    }



}
