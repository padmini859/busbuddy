package com.busbuddy.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ScheduleRequest {

    @NotNull(message = "Bus ID is required")
    private Long busId;

    @NotBlank(message = "Departure time is required (e.g., HH:mm:ss)")
    private String departureTime;

    private String serviceDay = "Daily";

    private String sourceReference = "DEMO DATA: TNSTC Coimbatore";

    public ScheduleRequest() {}

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getServiceDay() {
        return serviceDay;
    }

    public void setServiceDay(String serviceDay) {
        this.serviceDay = serviceDay;
    }

    public String getSourceReference() {
        return sourceReference;
    }

    public void setSourceReference(String sourceReference) {
        this.sourceReference = sourceReference;
    }
}
