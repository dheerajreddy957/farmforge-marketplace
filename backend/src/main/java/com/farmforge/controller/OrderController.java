package com.farmforge.controller;

import com.farmforge.model.OrderRequest;
import com.farmforge.model.PurchaseOrder;
import com.farmforge.service.DataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final DataService dataService;

    public OrderController(DataService dataService) {
        this.dataService = dataService;
    }

    @GetMapping
    public List<PurchaseOrder> getOrders() {
        return dataService.getOrders();
    }

    @PostMapping
    public ResponseEntity<PurchaseOrder> createOrder(@RequestBody OrderRequest request) {
        PurchaseOrder order = dataService.placeOrder(request);
        if (order == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(order);
    }
}
