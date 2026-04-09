package com.farmforge.controller;

import com.farmforge.model.LoginRequest;
import com.farmforge.model.User;
import com.farmforge.service.DataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final DataService dataService;

    public AuthController(DataService dataService) {
        this.dataService = dataService;
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest request) {
        if (request.getEmail() == null || request.getRole() == null) {
            return ResponseEntity.badRequest().build();
        }
        return dataService.findUserByEmail(request.getEmail())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(dataService.createUser(request.getName(), request.getEmail(), request.getRole())));
    }
}
