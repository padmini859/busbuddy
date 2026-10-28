package com.busbuddy.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class DirectRouteSearchResult {

    private Long routeId;
    private String routeName;
    private String direction;
    private List<String> busNumbers;
    private StopResponse boardingStop;
    private StopResponse destinationStop;
    private List<StopResponse> intermediateStops;
    private int intermediateStopsCount;
    private List<ScheduleResponse> scheduledDepartures;
    private BigDecimal fareAmount;
    private String serviceType;
    private LocalDateTime lastVerifiedAt;

    public DirectRouteSearchResult() {}

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public String getRouteName() {
        return routeName;
    }

    public void setRouteName(String routeName) {
        this.routeName = routeName;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public List<String> getBusNumbers() {
        return busNumbers;
    }

    public void setBusNumbers(List<String> busNumbers) {
        this.busNumbers = busNumbers;
    }

    public StopResponse getBoardingStop() {
        return boardingStop;
    }

    public void setBoardingStop(StopResponse boardingStop) {
        this.boardingStop = boardingStop;
    }

    public StopResponse getDestinationStop() {
        return destinationStop;
    }

    public void setDestinationStop(StopResponse destinationStop) {
        this.destinationStop = destinationStop;
    }

    public List<StopResponse> getIntermediateStops() {
        return intermediateStops;
    }

    public void setIntermediateStops(List<StopResponse> intermediateStops) {
        this.intermediateStops = intermediateStops;
    }

    public int getIntermediateStopsCount() {
        return intermediateStopsCount;
    }

    public void setIntermediateStopsCount(int intermediateStopsCount) {
        this.intermediateStopsCount = intermediateStopsCount;
    }

    public List<ScheduleResponse> getScheduledDepartures() {
        return scheduledDepartures;
    }

    public void setScheduledDepartures(List<ScheduleResponse> scheduledDepartures) {
        this.scheduledDepartures = scheduledDepartures;
    }

    public BigDecimal getFareAmount() {
        return fareAmount;
    }

    public void setFareAmount(BigDecimal fareAmount) {
        this.fareAmount = fareAmount;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public LocalDateTime getLastVerifiedAt() {
        return lastVerifiedAt;
    }

    public void setLastVerifiedAt(LocalDateTime lastVerifiedAt) {
        this.lastVerifiedAt = lastVerifiedAt;
    }
}
