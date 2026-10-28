package com.busbuddy.controller;

import com.busbuddy.dto.response.ApiResponse;
import com.busbuddy.entity.City;
import com.busbuddy.service.CityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/cities")
public class AdminCityController {

    private final CityService cityService;

    public AdminCityController(CityService cityService) {
        this.cityService = cityService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<City>> createCity(@RequestBody City city) {
        City created = cityService.createCity(city);
        return new ResponseEntity<>(ApiResponse.ok("City created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<City>> updateCity(@PathVariable Long id, @RequestBody City city) {
        City updated = cityService.updateCity(id, city);
        return ResponseEntity.ok(ApiResponse.ok("City updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCity(@PathVariable Long id) {
        cityService.deleteCity(id);
        return ResponseEntity.ok(ApiResponse.ok("City deleted successfully"));
    }
}
