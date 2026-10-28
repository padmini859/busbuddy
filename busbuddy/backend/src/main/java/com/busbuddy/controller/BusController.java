package com.busbuddy.controller;

import com.busbuddy.dto.response.ApiResponse;
import com.busbuddy.dto.response.BusResponse;
import com.busbuddy.service.BusService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
public class BusController {

    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BusResponse>>> getAllBuses() {
        List<BusResponse> buses = busService.getAllBuses();
        return ResponseEntity.ok(ApiResponse.ok("Buses fetched successfully", buses));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<BusResponse>>> searchBuses(@RequestParam(required = false, defaultValue = "") String number) {
        List<BusResponse> buses = busService.searchBusesByNumber(number);
        return ResponseEntity.ok(ApiResponse.ok("Bus search completed", buses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BusResponse>> getBusById(@PathVariable Long id) {
        BusResponse bus = busService.getBusById(id);
        return ResponseEntity.ok(ApiResponse.ok("Bus details fetched successfully", bus));
    }
}
