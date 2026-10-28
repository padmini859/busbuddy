package com.busbuddy.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class RouteRequest {

    @NotNull(message = "City ID is required")
    private Long cityId;

    @NotBlank(message = "Route name is required")
    private String routeName;

    @NotBlank(message = "Direction is required")
    private String direction;

    private Boolean active = true;

    private List<Long> stopIds; // Ordered list of stop IDs

    public RouteRequest() {}

    public Long getCityId() {
        return cityId;
    }

    public void setCityId(Long cityId) {
        this.cityId = cityId;
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

    public List<Long> getStopIds() {
        return stopIds;
    }

    public void setStopIds(List<Long> stopIds) {
        this.stopIds = stopIds;
    }
}
