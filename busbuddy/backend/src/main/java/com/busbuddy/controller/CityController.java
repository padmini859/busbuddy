package com.busbuddy.controller;

import com.busbuddy.dto.response.ApiResponse;
import com.busbuddy.entity.City;
import com.busbuddy.service.CityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
public class CityController {

    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<City>>> getAllCities() {
        List<City> cities = cityService.getAllCities();
        return ResponseEntity.ok(ApiResponse.ok("Cities fetched successfully", cities));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<City>> getCityById(@PathVariable Long id) {
        City city = cityService.getCityById(id);
        return ResponseEntity.ok(ApiResponse.ok("City fetched successfully", city));
    }
}
