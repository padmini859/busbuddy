package com.busbuddy.dto.response;

public class StopResponse {

    private Long stopId;
    private Long cityId;
    private String cityName;
    private String stopNameEn;
    private String stopNameTa;
    private Double latitude;
    private Double longitude;
    private Boolean active;
    private Integer servingRoutesCount;

    public StopResponse() {}

    public StopResponse(Long stopId, Long cityId, String cityName, String stopNameEn, String stopNameTa, Double latitude, Double longitude, Boolean active) {
        this.stopId = stopId;
        this.cityId = cityId;
        this.cityName = cityName;
        this.stopNameEn = stopNameEn;
        this.stopNameTa = stopNameTa;
        this.latitude = latitude;
        this.longitude = longitude;
        this.active = active;
    }

    public Long getStopId() {
        return stopId;
    }

    public void setStopId(Long stopId) {
        this.stopId = stopId;
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

    public String getStopNameEn() {
        return stopNameEn;
    }

    public void setStopNameEn(String stopNameEn) {
        this.stopNameEn = stopNameEn;
    }

    public String getStopNameTa() {
        return stopNameTa;
    }

    public void setStopNameTa(String stopNameTa) {
        this.stopNameTa = stopNameTa;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Integer getServingRoutesCount() {
        return servingRoutesCount;
    }

    public void setServingRoutesCount(Integer servingRoutesCount) {
        this.servingRoutesCount = servingRoutesCount;
    }
}
