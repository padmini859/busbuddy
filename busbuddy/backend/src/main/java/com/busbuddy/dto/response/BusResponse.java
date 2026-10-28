package com.busbuddy.dto.response;

public class BusResponse {

    private Long busId;
    private String busNumber;
    private Long routeId;
    private String routeName;
    private String direction;
    private String serviceType;
    private Boolean active;
    private Integer schedulesCount;

    public BusResponse() {}

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }

    public String getBusNumber() {
        return busNumber;
    }

    public void setBusNumber(String busNumber) {
        this.busNumber = busNumber;
    }

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

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Integer getSchedulesCount() {
        return schedulesCount;
    }

    public void setSchedulesCount(Integer schedulesCount) {
        this.schedulesCount = schedulesCount;
    }
}
