package com.busbuddy.controller;

import com.busbuddy.dto.request.RouteRequest;
import com.busbuddy.dto.response.ApiResponse;
import com.busbuddy.dto.response.RouteDetailResponse;
import com.busbuddy.service.RouteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/routes")
public class AdminRouteController {

    private final RouteService routeService;

    public AdminRouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RouteDetailResponse>> createRoute(@Valid @RequestBody RouteRequest request) {
        RouteDetailResponse created = routeService.createRoute(request);
        return new ResponseEntity<>(ApiResponse.ok("Route created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RouteDetailResponse>> updateRoute(
            @PathVariable Long id, @Valid @RequestBody RouteRequest request) {
        RouteDetailResponse updated = routeService.updateRoute(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Route updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
        return ResponseEntity.ok(ApiResponse.ok("Route deleted successfully"));
    }
}
