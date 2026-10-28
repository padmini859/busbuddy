package com.busbuddy.controller;

import com.busbuddy.dto.request.BusRequest;
import com.busbuddy.dto.response.ApiResponse;
import com.busbuddy.dto.response.BusResponse;
import com.busbuddy.service.BusService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/buses")
public class AdminBusController {

    private final BusService busService;

    public AdminBusController(BusService busService) {
        this.busService = busService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BusResponse>> createBus(@Valid @RequestBody BusRequest request) {
        BusResponse created = busService.createBus(request);
        return new ResponseEntity<>(ApiResponse.ok("Bus registered successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BusResponse>> updateBus(@PathVariable Long id, @Valid @RequestBody BusRequest request) {
        BusResponse updated = busService.updateBus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Bus updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBus(@PathVariable Long id) {
        busService.deleteBus(id);
        return ResponseEntity.ok(ApiResponse.ok("Bus deleted successfully"));
    }
}
