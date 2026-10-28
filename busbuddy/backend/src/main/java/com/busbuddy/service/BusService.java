package com.busbuddy.service;

import com.busbuddy.dto.request.BusRequest;
import com.busbuddy.dto.response.BusResponse;
import java.util.List;

public interface BusService {
    List<BusResponse> searchBusesByNumber(String busNumber);
    List<BusResponse> getAllBuses();
    BusResponse getBusById(Long id);
    BusResponse createBus(BusRequest request);
    BusResponse updateBus(Long id, BusRequest request);
    void deleteBus(Long id);
}
