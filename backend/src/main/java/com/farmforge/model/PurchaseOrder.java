package com.farmforge.model;

public class PurchaseOrder {
    private String id;
    private String product;
    private String buyer;
    private String farmer;
    private String status;
    private double total;
    private String date;

    public PurchaseOrder() {
    }

    public PurchaseOrder(String id, String product, String buyer, String farmer, String status, double total,
            String date) {
        this.id = id;
        this.product = product;
        this.buyer = buyer;
        this.farmer = farmer;
        this.status = status;
        this.total = total;
        this.date = date;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public String getBuyer() {
        return buyer;
    }

    public void setBuyer(String buyer) {
        this.buyer = buyer;
    }

    public String getFarmer() {
        return farmer;
    }

    public void setFarmer(String farmer) {
        this.farmer = farmer;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
