package com.busbuddy.controller;

import com.busbuddy.dto.response.ApiResponse;
import com.busbuddy.dto.response.StopResponse;
import com.busbuddy.service.StopService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stops")
public class StopController {

    private final StopService stopService;

    public StopController(StopService stopService) {
        this.stopService = stopService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StopResponse>>> getAllStops() {
        List<StopResponse> stops = stopService.getAllActiveStops();
        return ResponseEntity.ok(ApiResponse.ok("Bus stops fetched successfully", stops));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<StopResponse>>> getPopularStops() {
        List<StopResponse> stops = stopService.getPopularStops();
        return ResponseEntity.ok(ApiResponse.ok("Popular stops fetched successfully", stops));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<StopResponse>>> searchStops(@RequestParam(required = false, defaultValue = "") String query) {
        List<StopResponse> stops = stopService.searchStops(query);
        return ResponseEntity.ok(ApiResponse.ok("Bus stops matched successfully", stops));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StopResponse>> getStopById(@PathVariable Long id) {
        StopResponse stop = stopService.getStopById(id);
        return ResponseEntity.ok(ApiResponse.ok("Stop details fetched successfully", stop));
    }
}
