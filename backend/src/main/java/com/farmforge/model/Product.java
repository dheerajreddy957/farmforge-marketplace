package com.farmforge.model;

public class Product {
    private int id;
    private String name;
    private String category;
    private String farmer;
    private double price;
    private int quantity;
    private String description;

    public Product() {}

    public Product(int id, String name, String category, String farmer, double price, int quantity, String description) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.farmer = farmer;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getFarmer() { return farmer; }
    public void setFarmer(String farmer) { this.farmer = farmer; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
