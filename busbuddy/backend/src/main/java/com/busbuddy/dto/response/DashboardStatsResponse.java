package com.busbuddy.dto.response;

import java.util.List;

public class DashboardStatsResponse {

    private long totalBuses;
    private long totalRoutes;
    private long totalStops;
    private long totalSchedules;
    private long pendingFeedbackCount;
    private List<FeedbackResponse> recentFeedback;

    public DashboardStatsResponse() {}

    public DashboardStatsResponse(long totalBuses, long totalRoutes, long totalStops, long totalSchedules, long pendingFeedbackCount, List<FeedbackResponse> recentFeedback) {
        this.totalBuses = totalBuses;
        this.totalRoutes = totalRoutes;
        this.totalStops = totalStops;
        this.totalSchedules = totalSchedules;
        this.pendingFeedbackCount = pendingFeedbackCount;
        this.recentFeedback = recentFeedback;
    }

    public long getTotalBuses() {
        return totalBuses;
    }

    public void setTotalBuses(long totalBuses) {
        this.totalBuses = totalBuses;
    }

    public long getTotalRoutes() {
        return totalRoutes;
    }

    public void setTotalRoutes(long totalRoutes) {
        this.totalRoutes = totalRoutes;
    }

    public long getTotalStops() {
        return totalStops;
    }

    public void setTotalStops(long totalStops) {
        this.totalStops = totalStops;
    }

    public long getTotalSchedules() {
        return totalSchedules;
    }

    public void setTotalSchedules(long totalSchedules) {
        this.totalSchedules = totalSchedules;
    }

    public long getPendingFeedbackCount() {
        return pendingFeedbackCount;
    }

    public void setPendingFeedbackCount(long pendingFeedbackCount) {
        this.pendingFeedbackCount = pendingFeedbackCount;
    }

    public List<FeedbackResponse> getRecentFeedback() {
        return recentFeedback;
    }

    public void setRecentFeedback(List<FeedbackResponse> recentFeedback) {
        this.recentFeedback = recentFeedback;
    }
}
