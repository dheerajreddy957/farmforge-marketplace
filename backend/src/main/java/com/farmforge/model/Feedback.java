package com.farmforge.model;

public class Feedback {
    private int id;
    private String author;
    private String role;
    private String product;
    private int rating;
    private String note;

    public Feedback() {
    }

    public Feedback(int id, String author, String role, String product, int rating, String note) {
        this.id = id;
        this.author = author;
        this.role = role;
        this.product = product;
        this.rating = rating;
        this.note = note;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
