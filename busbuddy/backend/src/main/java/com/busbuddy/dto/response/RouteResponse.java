package com.busbuddy.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class RouteResponse {

    private Long routeId;
    private Long cityId;
    private String cityName;
    private String routeName;
    private String direction;
    private Boolean active;
    private LocalDateTime lastVerifiedAt;
    private Integer totalStops;
    private String startingStopName;
    private String endingStopName;
    private List<String> busNumbers;

    public RouteResponse() {}

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

    public Integer getTotalStops() {
        return totalStops;
    }

    public void setTotalStops(Integer totalStops) {
        this.totalStops = totalStops;
    }

    public String getStartingStopName() {
        return startingStopName;
    }

    public void setStartingStopName(String startingStopName) {
        this.startingStopName = startingStopName;
    }

    public String getEndingStopName() {
        return endingStopName;
    }

    public void setEndingStopName(String endingStopName) {
        this.endingStopName = endingStopName;
    }

    public List<String> getBusNumbers() {
        return busNumbers;
    }

    public void setBusNumbers(List<String> busNumbers) {
        this.busNumbers = busNumbers;
    }
}
