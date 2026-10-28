package com.busbuddy.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class RouteDetailResponse {

    private Long routeId;
    private Long cityId;
    private String cityName;
    private String routeName;
    private String direction;
    private Boolean active;
    private LocalDateTime lastVerifiedAt;
    private List<StopResponse> stops;
    private List<BusResponse> buses;
    private List<ScheduleResponse> schedules;

    public RouteDetailResponse() {}

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public Long getCityId() {
        return cityId;
    }

    public void setCityId(Long cityId) {
        this.cityId = cityId;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
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

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public LocalDateTime getLastVerifiedAt() {
        return lastVerifiedAt;
    }

    public void setLastVerifiedAt(LocalDateTime lastVerifiedAt) {
        this.lastVerifiedAt = lastVerifiedAt;
    }

    public List<StopResponse> getStops() {
        return stops;
    }

    public void setStops(List<StopResponse> stops) {
        this.stops = stops;
    }

    public List<BusResponse> getBuses() {
        return buses;
    }

    public void setBuses(List<BusResponse> buses) {
        this.buses = buses;
    }

    public List<ScheduleResponse> getSchedules() {
        return schedules;
    }

    public void setSchedules(List<ScheduleResponse> schedules) {
        this.schedules = schedules;
    }
}
