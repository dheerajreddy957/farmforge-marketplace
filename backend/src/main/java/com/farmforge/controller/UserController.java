package com.farmforge.controller;

import com.farmforge.model.User;
import com.farmforge.service.DataService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final DataService dataService;

    public UserController(DataService dataService) {
        this.dataService = dataService;
    }

    @GetMapping
    public List<User> getUsers() {
        return dataService.getUsers();
    }
}
