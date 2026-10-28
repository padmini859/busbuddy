package com.busbuddy.controller;

import com.busbuddy.dto.request.FeedbackRequest;
import com.busbuddy.dto.response.ApiResponse;
import com.busbuddy.dto.response.FeedbackResponse;
import com.busbuddy.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FeedbackResponse>> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        FeedbackResponse feedback = feedbackService.submitFeedback(request);
        return new ResponseEntity<>(ApiResponse.ok("Thank you! Your feedback has been received and logged for review.", feedback), HttpStatus.CREATED);
    }
}
