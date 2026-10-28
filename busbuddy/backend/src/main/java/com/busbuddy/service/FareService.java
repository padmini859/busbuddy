package com.busbuddy.service;

import com.busbuddy.dto.request.FareRequest;
import com.busbuddy.dto.response.FareResponse;
import java.util.List;

public interface FareService {
    List<FareResponse> getAllFares();
    FareResponse getFareById(Long id);
    FareResponse createFare(FareRequest request);
    FareResponse updateFare(Long id, FareRequest request);
    void deleteFare(Long id);
}
