package com.farmforge.controller;

import com.farmforge.model.Product;
import com.farmforge.service.DataService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final DataService dataService;

    public ProductController(DataService dataService) {
        this.dataService = dataService;
    }

    @GetMapping
    public List<Product> getProducts() {
        return dataService.getProducts();
    }
}
