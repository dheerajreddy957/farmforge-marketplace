package com.farmforge.service;

import com.farmforge.model.Feedback;
import com.farmforge.model.FeedbackRequest;
import com.farmforge.model.LoginRequest;
import com.farmforge.model.OrderRequest;
import com.farmforge.model.Product;
import com.farmforge.model.PurchaseOrder;
import com.farmforge.model.User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class DataService {
    private final List<User> users = new ArrayList<>();
    private final List<Product> products = new ArrayList<>();
    private final List<PurchaseOrder> orders = new ArrayList<>();
    private final List<Feedback> feedback = new ArrayList<>();

    public DataService() {
        users.add(new User(1, "Priya Sharma", "priya@farmforge.com", "Farmer", "Active"));
        users.add(new User(2, "Samuel Ortiz", "samuel@globalbuyer.com", "Buyer", "Active"));
        users.add(new User(3, "Ayesha Khan", "ayesha@adminhub.com", "Admin", "Active"));

        products.add(new Product(1, "Organic Mango Jam", "Processed Food", "Priya Sharma", 18.0, 120,
                "Premium mango jam crafted from fresh orchard fruit."));
        products.add(new Product(2, "Handmade Wheat Snacks", "Snack Food", "Priya Sharma", 12.0, 80,
                "Nutritious snacks made with locally grown wheat."));
        products.add(new Product(3, "Dried Chili Powder", "Spice", "Priya Sharma", 9.0, 210,
                "Bold spice powder from rural agriculture producers."));

        orders.add(new PurchaseOrder("ORD-1001", "Organic Mango Jam", "Samuel Ortiz", "Priya Sharma", "Pending", 180.0,
                "2026-04-05"));
        orders.add(new PurchaseOrder("ORD-1002", "Dried Chili Powder", "Samuel Ortiz", "Priya Sharma", "Completed",
                54.0, "2026-03-29"));

        feedback.add(new Feedback(1, "Samuel Ortiz", "Buyer", "Organic Mango Jam", 5,
                "Authentic farm flavor and excellent packaging."));
        feedback.add(new Feedback(2, "Renuka Patel", "Buyer", "Dried Chili Powder", 4,
                "Great aroma and consistent quality."));
    }

    public Optional<User> findUserByEmail(String email) {
        return users.stream().filter(user -> user.getEmail().equalsIgnoreCase(email)).findFirst();
    }

    public User createUser(String name, String email, String role) {
        int id = users.size() + 1;
        User newUser = new User(id, name, email, role, "Active");
        users.add(newUser);
        return newUser;
    }

    public List<User> getUsers() {
        return Collections.unmodifiableList(users);
    }

    public List<Product> getProducts() {
        return Collections.unmodifiableList(products);
    }

    public List<PurchaseOrder> getOrders() {
        return Collections.unmodifiableList(orders);
    }

    public PurchaseOrder placeOrder(OrderRequest request) {
        Optional<Product> productOpt = products.stream().filter(product -> product.getId() == request.getProductId())
                .findFirst();
        if (productOpt.isEmpty()) {
            return null;
        }

        Product product = productOpt.get();
        int quantity = Math.max(1, request.getQuantity());
        if (product.getQuantity() < quantity) {
            quantity = product.getQuantity();
        }
        if (quantity <= 0) {
            return null;
        }

        product.setQuantity(product.getQuantity() - quantity);
        String id = String.format("ORD-%04d", orders.size() + 1001);
        double total = product.getPrice() * quantity;
        String date = LocalDate.now().toString();
        PurchaseOrder order = new PurchaseOrder(id, product.getName(), request.getBuyer(), product.getFarmer(),
                "Pending", total, date);
        orders.add(0, order);
        return order;
    }

    public List<Feedback> getFeedback() {
        return Collections.unmodifiableList(feedback);
    }

    public Feedback submitFeedback(FeedbackRequest request) {
        Optional<Product> productOpt = products.stream().filter(product -> product.getId() == request.getProductId())
                .findFirst();
        if (productOpt.isEmpty()) {
            return null;
        }
        Product product = productOpt.get();
        Feedback newFeedback = new Feedback(feedback.size() + 1, request.getAuthor(), request.getRole(),
                product.getName(), request.getRating(), request.getNote());
        feedback.add(0, newFeedback);
        return newFeedback;
    }
}
