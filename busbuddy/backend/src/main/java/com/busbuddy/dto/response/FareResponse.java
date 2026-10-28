package com.busbuddy.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class FareResponse {

    private Long fareId;
    private Long routeId;
    private String routeName;
    private Long sourceStopId;
    private String sourceStopName;
    private Long destinationStopId;
    private String destinationStopName;
    private BigDecimal amount;
    private String fareType;
    private LocalDateTime lastVerifiedAt;

    public FareResponse() {}

    public Long getFareId() {
        return fareId;
    }

    public void setFareId(Long fareId) {
        this.fareId = fareId;
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

    public Long getSourceStopId() {
        return sourceStopId;
    }

    public void setSourceStopId(Long sourceStopId) {
        this.sourceStopId = sourceStopId;
    }

    public String getSourceStopName() {
        return sourceStopName;
    }

    public void setSourceStopName(String sourceStopName) {
        this.sourceStopName = sourceStopName;
    }

    public Long getDestinationStopId() {
        return destinationStopId;
    }

    public void setDestinationStopId(Long destinationStopId) {
        this.destinationStopId = destinationStopId;
    }

    public String getDestinationStopName() {
        return destinationStopName;
    }

    public void setDestinationStopName(String destinationStopName) {
        this.destinationStopName = destinationStopName;
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

    public LocalDateTime getLastVerifiedAt() {
        return lastVerifiedAt;
    }

    public void setLastVerifiedAt(LocalDateTime lastVerifiedAt) {
        this.lastVerifiedAt = lastVerifiedAt;
    }
}
