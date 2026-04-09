package com.farmforge.controller;

import com.farmforge.model.Feedback;
import com.farmforge.model.FeedbackRequest;
import com.farmforge.service.DataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    private final DataService dataService;

    public FeedbackController(DataService dataService) {
        this.dataService = dataService;
    }

    @GetMapping
    public List<Feedback> getFeedback() {
        return dataService.getFeedback();
    }

    @PostMapping
    public ResponseEntity<Feedback> createFeedback(@RequestBody FeedbackRequest request) {
        Feedback saved = dataService.submitFeedback(request);
        if (saved == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(saved);
    }
}
