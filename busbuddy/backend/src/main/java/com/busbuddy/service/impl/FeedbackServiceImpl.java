package com.busbuddy.service.impl;

import com.busbuddy.dto.request.FeedbackRequest;
import com.busbuddy.dto.response.FeedbackResponse;
import com.busbuddy.entity.Feedback;
import com.busbuddy.entity.Route;
import com.busbuddy.exception.ResourceNotFoundException;
import com.busbuddy.repository.FeedbackRepository;
import com.busbuddy.repository.RouteRepository;
import com.busbuddy.service.FeedbackService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final RouteRepository routeRepository;

    public FeedbackServiceImpl(FeedbackRepository feedbackRepository, RouteRepository routeRepository) {
        this.feedbackRepository = feedbackRepository;
        this.routeRepository = routeRepository;
    }

    @Override
    public FeedbackResponse submitFeedback(FeedbackRequest request) {
        Feedback feedback = new Feedback();

        if (request.getRouteId() != null) {
            Route route = routeRepository.findById(request.getRouteId()).orElse(null);
            feedback.setRoute(route);
        }

        feedback.setCategory(request.getCategory().trim());
        feedback.setDescription(request.getDescription().trim());
        feedback.setContactInfo(StringUtils.hasText(request.getContactInfo()) ? request.getContactInfo().trim() : null);
        feedback.setStatus("PENDING");
        feedback.setCreatedAt(LocalDateTime.now());

        Feedback saved = feedbackRepository.save(feedback);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeedbackResponse> getAllFeedback(String status) {
        List<Feedback> list;
        if (StringUtils.hasText(status)) {
            list = feedbackRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase().trim());
        } else {
            list = feedbackRepository.findAllByOrderByCreatedAtDesc();
        }
        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public FeedbackResponse updateFeedbackStatus(Long id, String status) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with ID: " + id));

        feedback.setStatus(status.toUpperCase().trim());
        Feedback saved = feedbackRepository.save(feedback);
        return mapToResponse(saved);
    }

    @Override
    public void deleteFeedback(Long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with ID: " + id));
        feedbackRepository.delete(feedback);
    }

    private FeedbackResponse mapToResponse(Feedback fb) {
        FeedbackResponse res = new FeedbackResponse();
        res.setFeedbackId(fb.getFeedbackId());
        res.setRouteId(fb.getRoute() != null ? fb.getRoute().getRouteId() : null);
        res.setRouteName(fb.getRoute() != null ? fb.getRoute().getRouteName() : null);
        res.setCategory(fb.getCategory());
        res.setDescription(fb.getDescription());
        res.setContactInfo(fb.getContactInfo());
        res.setStatus(fb.getStatus());
        res.setCreatedAt(fb.getCreatedAt());
        return res;
    }
}
