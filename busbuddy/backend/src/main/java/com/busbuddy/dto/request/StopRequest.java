package com.busbuddy.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class StopRequest {

    @NotNull(message = "City ID is required")
    private Long cityId;

    @NotBlank(message = "English stop name is required")
    private String stopNameEn;

    @NotBlank(message = "Tamil stop name is required")
    private String stopNameTa;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private Boolean active = true;

    public StopRequest() {}

    public Long getCityId() {
        return cityId;
    }

    public void setCityId(Long cityId) {
        this.cityId = cityId;
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
}
