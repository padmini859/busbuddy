package com.busbuddy.controller;

import com.busbuddy.dto.request.FareRequest;
import com.busbuddy.dto.response.ApiResponse;
import com.busbuddy.dto.response.FareResponse;
import com.busbuddy.service.FareService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/fares")
public class AdminFareController {

    private final FareService fareService;

    public AdminFareController(FareService fareService) {
        this.fareService = fareService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FareResponse>>> getAllFares() {
        List<FareResponse> fares = fareService.getAllFares();
        return ResponseEntity.ok(ApiResponse.ok("Fares fetched successfully", fares));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FareResponse>> createFare(@Valid @RequestBody FareRequest request) {
        FareResponse created = fareService.createFare(request);
        return new ResponseEntity<>(ApiResponse.ok("Fare entry created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FareResponse>> updateFare(
            @PathVariable Long id, @Valid @RequestBody FareRequest request) {
        FareResponse updated = fareService.updateFare(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Fare updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFare(@PathVariable Long id) {
        fareService.deleteFare(id);
        return ResponseEntity.ok(ApiResponse.ok("Fare deleted successfully"));
    }
}
