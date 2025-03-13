package com.example.workflow.model;
import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private String id;

    @Column(name = "category_name", length = 100, nullable = false)
    private String categoryName;

    @Column(name = "category_image", length = 255)
    private String categoryImage;

    @Column(name = "description")
    private String description;

    public Category() {
    }
}
