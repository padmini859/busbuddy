package com.busbuddy.dto.response;

import java.math.BigDecimal;

public class ConnectingRouteSearchResult {

    private DirectRouteSearchResult firstLeg;
    private DirectRouteSearchResult secondLeg;
    private StopResponse transferStop;
    private int totalTransfers = 1;
    private int totalIntermediateStops;
    private BigDecimal totalEstimatedFare;
    private String connectionNote = "Possible route connection (Demo timetable). Please allow sufficient transfer time.";

    public ConnectingRouteSearchResult() {}

    public ConnectingRouteSearchResult(DirectRouteSearchResult firstLeg, DirectRouteSearchResult secondLeg, StopResponse transferStop) {
        this.firstLeg = firstLeg;
        this.secondLeg = secondLeg;
        this.transferStop = transferStop;
        this.totalIntermediateStops = (firstLeg != null ? firstLeg.getIntermediateStopsCount() : 0) +
                                      (secondLeg != null ? secondLeg.getIntermediateStopsCount() : 0);
        BigDecimal fare1 = firstLeg != null && firstLeg.getFareAmount() != null ? firstLeg.getFareAmount() : BigDecimal.ZERO;
        BigDecimal fare2 = secondLeg != null && secondLeg.getFareAmount() != null ? secondLeg.getFareAmount() : BigDecimal.ZERO;
        this.totalEstimatedFare = fare1.add(fare2);
    }

    public DirectRouteSearchResult getFirstLeg() {
        return firstLeg;
    }

    public void setFirstLeg(DirectRouteSearchResult firstLeg) {
        this.firstLeg = firstLeg;
    }

    public DirectRouteSearchResult getSecondLeg() {
        return secondLeg;
    }

    public void setSecondLeg(DirectRouteSearchResult secondLeg) {
        this.secondLeg = secondLeg;
    }

    public StopResponse getTransferStop() {
        return transferStop;
    }

    public void setTransferStop(StopResponse transferStop) {
        this.transferStop = transferStop;
    }

    public int getTotalTransfers() {
        return totalTransfers;
    }

    public void setTotalTransfers(int totalTransfers) {
        this.totalTransfers = totalTransfers;
    }

    public int getTotalIntermediateStops() {
        return totalIntermediateStops;
    }

    public void setTotalIntermediateStops(int totalIntermediateStops) {
        this.totalIntermediateStops = totalIntermediateStops;
    }

    public BigDecimal getTotalEstimatedFare() {
        return totalEstimatedFare;
    }

    public void setTotalEstimatedFare(BigDecimal totalEstimatedFare) {
        this.totalEstimatedFare = totalEstimatedFare;
    }

    public String getConnectionNote() {
        return connectionNote;
    }

    public void setConnectionNote(String connectionNote) {
        this.connectionNote = connectionNote;
    }
}
