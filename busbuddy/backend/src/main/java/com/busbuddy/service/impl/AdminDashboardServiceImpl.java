package com.busbuddy.service.impl;

import com.busbuddy.dto.response.DashboardStatsResponse;
import com.busbuddy.dto.response.FeedbackResponse;
import com.busbuddy.repository.*;
import com.busbuddy.service.AdminDashboardService;
import com.busbuddy.service.FeedbackService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final BusRepository busRepository;
    private final RouteRepository routeRepository;
    private final StopRepository stopRepository;
    private final ScheduleRepository scheduleRepository;
    private final FeedbackRepository feedbackRepository;
    private final FeedbackService feedbackService;

    public AdminDashboardServiceImpl(BusRepository busRepository,
                                     RouteRepository routeRepository,
                                     StopRepository stopRepository,
                                     ScheduleRepository scheduleRepository,
                                     FeedbackRepository feedbackRepository,
                                     FeedbackService feedbackService) {
        this.busRepository = busRepository;
        this.routeRepository = routeRepository;
        this.stopRepository = stopRepository;
        this.scheduleRepository = scheduleRepository;
        this.feedbackRepository = feedbackRepository;
        this.feedbackService = feedbackService;
    }

    @Override
    public DashboardStatsResponse getDashboardStats() {
        long totalBuses = busRepository.count();
        long totalRoutes = routeRepository.count();
        long totalStops = stopRepository.count();
        long totalSchedules = scheduleRepository.count();
        long pendingFeedbackCount = feedbackRepository.countByStatus("PENDING");

        List<FeedbackResponse> recentFeedback = feedbackService.getAllFeedback(null)
                .stream()
                .limit(5)
                .collect(Collectors.toList());

        return new DashboardStatsResponse(
                totalBuses,
                totalRoutes,
                totalStops,
                totalSchedules,
                pendingFeedbackCount,
                recentFeedback
        );
    }
}
