package com.busbuddy.controller;

import com.busbuddy.dto.response.*;
import com.busbuddy.service.RouteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getAllRoutes() {
        List<RouteResponse> routes = routeService.getAllRoutes();
        return ResponseEntity.ok(ApiResponse.ok("Routes fetched successfully", routes));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<RouteSearchResponse>> searchRoutes(
            @RequestParam("sourceId") Long sourceId,
            @RequestParam("destinationId") Long destinationId) {
        RouteSearchResponse response = routeService.searchRoutes(sourceId, destinationId);
        return ResponseEntity.ok(ApiResponse.ok("Route search completed successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RouteDetailResponse>> getRouteById(@PathVariable Long id) {
        RouteDetailResponse detail = routeService.getRouteDetail(id);
        return ResponseEntity.ok(ApiResponse.ok("Route details fetched successfully", detail));
    }

    @GetMapping("/{id}/stops")
    public ResponseEntity<ApiResponse<List<StopResponse>>> getRouteStops(@PathVariable Long id) {
        List<StopResponse> stops = routeService.getRouteStops(id);
        return ResponseEntity.ok(ApiResponse.ok("Route stops fetched successfully", stops));
    }

    @GetMapping("/{id}/schedules")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getRouteSchedules(@PathVariable Long id) {
        List<ScheduleResponse> schedules = routeService.getRouteSchedules(id);
        return ResponseEntity.ok(ApiResponse.ok("Route schedules fetched successfully", schedules));
    }
}
