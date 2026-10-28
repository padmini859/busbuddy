package com.busbuddy.controller;

import com.busbuddy.dto.response.ApiResponse;
import com.busbuddy.dto.response.FeedbackResponse;
import com.busbuddy.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/feedback")
public class AdminFeedbackController {

    private final FeedbackService feedbackService;

    public AdminFeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FeedbackResponse>>> getAllFeedback(
            @RequestParam(required = false) String status) {
        List<FeedbackResponse> feedback = feedbackService.getAllFeedback(status);
        return ResponseEntity.ok(ApiResponse.ok("Feedback retrieved successfully", feedback));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<FeedbackResponse>> updateStatus(
            @PathVariable Long id, @RequestParam String status) {
        FeedbackResponse updated = feedbackService.updateFeedbackStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Feedback status updated to " + status, updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.ok(ApiResponse.ok("Feedback record deleted successfully"));
    }
}
