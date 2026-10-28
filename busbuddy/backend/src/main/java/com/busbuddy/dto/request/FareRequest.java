package com.busbuddy.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class FareRequest {

    @NotNull(message = "Route ID is required")
    private Long routeId;

    @NotNull(message = "Source stop ID is required")
    private Long sourceStopId;

    @NotNull(message = "Destination stop ID is required")
    private Long destinationStopId;

    @NotNull(message = "Fare amount is required")
    @Positive(message = "Fare amount must be positive")
    private BigDecimal amount;

    private String fareType = "Regular";

    public FareRequest() {}

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public Long getSourceStopId() {
        return sourceStopId;
    }

    public void setSourceStopId(Long sourceStopId) {
        this.sourceStopId = sourceStopId;
    }

    public Long getDestinationStopId() {
        return destinationStopId;
    }

    public void setDestinationStopId(Long destinationStopId) {
        this.destinationStopId = destinationStopId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getFareType() {
        return fareType;
    }

    public void setFareType(String fareType) {
        this.fareType = fareType;
    }
}
