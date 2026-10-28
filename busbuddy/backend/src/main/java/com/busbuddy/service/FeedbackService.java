package com.busbuddy.service;

import com.busbuddy.dto.request.FeedbackRequest;
import com.busbuddy.dto.response.FeedbackResponse;
import java.util.List;

public interface FeedbackService {
    FeedbackResponse submitFeedback(FeedbackRequest request);
    List<FeedbackResponse> getAllFeedback(String status);
    FeedbackResponse updateFeedbackStatus(Long id, String status);
    void deleteFeedback(Long id);
}
