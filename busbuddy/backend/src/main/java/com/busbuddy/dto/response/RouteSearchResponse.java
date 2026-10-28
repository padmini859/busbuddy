package com.busbuddy.dto.response;

import java.util.List;

public class RouteSearchResponse {

    private StopResponse sourceStop;
    private StopResponse destinationStop;
    private List<DirectRouteSearchResult> directRoutes;
    private List<ConnectingRouteSearchResult> connectingRoutes;
    private int totalDirectRoutes;
    private int totalConnectingRoutes;

    public RouteSearchResponse() {}

    public RouteSearchResponse(StopResponse sourceStop, StopResponse destinationStop,
                               List<DirectRouteSearchResult> directRoutes,
                               List<ConnectingRouteSearchResult> connectingRoutes) {
        this.sourceStop = sourceStop;
        this.destinationStop = destinationStop;
        this.directRoutes = directRoutes;
        this.connectingRoutes = connectingRoutes;
        this.totalDirectRoutes = directRoutes != null ? directRoutes.size() : 0;
        this.totalConnectingRoutes = connectingRoutes != null ? connectingRoutes.size() : 0;
    }

    public StopResponse getSourceStop() {
        return sourceStop;
    }

    public void setSourceStop(StopResponse sourceStop) {
        this.sourceStop = sourceStop;
    }

    public StopResponse getDestinationStop() {
        return destinationStop;
    }

    public void setDestinationStop(StopResponse destinationStop) {
        this.destinationStop = destinationStop;
    }

    public List<DirectRouteSearchResult> getDirectRoutes() {
        return directRoutes;
    }

    public void setDirectRoutes(List<DirectRouteSearchResult> directRoutes) {
        this.directRoutes = directRoutes;
        this.totalDirectRoutes = directRoutes != null ? directRoutes.size() : 0;
    }

    public List<ConnectingRouteSearchResult> getConnectingRoutes() {
        return connectingRoutes;
    }

    public void setConnectingRoutes(List<ConnectingRouteSearchResult> connectingRoutes) {
        this.connectingRoutes = connectingRoutes;
        this.totalConnectingRoutes = connectingRoutes != null ? connectingRoutes.size() : 0;
    }

    public int getTotalDirectRoutes() {
        return totalDirectRoutes;
    }

    public void setTotalDirectRoutes(int totalDirectRoutes) {
        this.totalDirectRoutes = totalDirectRoutes;
    }

    public int getTotalConnectingRoutes() {
        return totalConnectingRoutes;
    }

    public void setTotalConnectingRoutes(int totalConnectingRoutes) {
        this.totalConnectingRoutes = totalConnectingRoutes;
    }
}
