package com.busbuddy.controller;

import com.busbuddy.dto.request.StopRequest;
import com.busbuddy.dto.response.ApiResponse;
import com.busbuddy.dto.response.StopResponse;
import com.busbuddy.service.StopService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/stops")
public class AdminStopController {

    private final StopService stopService;

    public AdminStopController(StopService stopService) {
        this.stopService = stopService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StopResponse>> createStop(@Valid @RequestBody StopRequest request) {
        StopResponse created = stopService.createStop(request);
        return new ResponseEntity<>(ApiResponse.ok("Bus stop created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StopResponse>> updateStop(@PathVariable Long id, @Valid @RequestBody StopRequest request) {
        StopResponse updated = stopService.updateStop(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Bus stop updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStop(@PathVariable Long id) {
        stopService.deleteStop(id);
        return ResponseEntity.ok(ApiResponse.ok("Bus stop deleted successfully"));
    }
}
