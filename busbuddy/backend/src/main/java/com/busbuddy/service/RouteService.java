package com.busbuddy.service;

import com.busbuddy.dto.request.RouteRequest;
import com.busbuddy.dto.response.*;

import java.util.List;

public interface RouteService {
    RouteSearchResponse searchRoutes(Long sourceStopId, Long destinationStopId);
    List<RouteResponse> getAllRoutes();
    RouteDetailResponse getRouteDetail(Long routeId);
    List<StopResponse> getRouteStops(Long routeId);
    List<ScheduleResponse> getRouteSchedules(Long routeId);
    RouteDetailResponse createRoute(RouteRequest request);
    RouteDetailResponse updateRoute(Long routeId, RouteRequest request);
    void deleteRoute(Long routeId);
}
