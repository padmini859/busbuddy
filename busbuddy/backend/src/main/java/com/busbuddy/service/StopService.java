package com.busbuddy.service;

import com.busbuddy.dto.request.StopRequest;
import com.busbuddy.dto.response.StopResponse;
import java.util.List;

public interface StopService {
    List<StopResponse> getAllActiveStops();
    List<StopResponse> getPopularStops();
    List<StopResponse> searchStops(String query);
    StopResponse getStopById(Long id);
    StopResponse createStop(StopRequest request);
    StopResponse updateStop(Long id, StopRequest request);
    void deleteStop(Long id);
}
