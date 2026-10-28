package com.busbuddy.service.impl;

import com.busbuddy.dto.request.BusRequest;
import com.busbuddy.dto.response.BusResponse;
import com.busbuddy.entity.Bus;
import com.busbuddy.entity.Route;
import com.busbuddy.exception.ResourceNotFoundException;
import com.busbuddy.repository.BusRepository;
import com.busbuddy.repository.RouteRepository;
import com.busbuddy.service.BusService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BusServiceImpl implements BusService {

    private final BusRepository busRepository;
    private final RouteRepository routeRepository;

    public BusServiceImpl(BusRepository busRepository, RouteRepository routeRepository) {
        this.busRepository = busRepository;
        this.routeRepository = routeRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BusResponse> searchBusesByNumber(String busNumber) {
        if (!StringUtils.hasText(busNumber)) {
            return getAllBuses();
        }
        return busRepository.searchByBusNumber(busNumber.trim())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BusResponse> getAllBuses() {
        return busRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BusResponse getBusById(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with ID: " + id));
        return mapToResponse(bus);
    }

    @Override
    public BusResponse createBus(BusRequest request) {
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + request.getRouteId()));

        Bus bus = new Bus();
        bus.setBusNumber(request.getBusNumber().trim());
        bus.setRoute(route);
        bus.setServiceType(StringUtils.hasText(request.getServiceType()) ? request.getServiceType().trim() : "Ordinary");
        bus.setActive(request.getActive() != null ? request.getActive() : true);

        Bus saved = busRepository.save(bus);
        return mapToResponse(saved);
    }

    @Override
    public BusResponse updateBus(Long id, BusRequest request) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with ID: " + id));

        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + request.getRouteId()));

        bus.setBusNumber(request.getBusNumber().trim());
        bus.setRoute(route);
        if (StringUtils.hasText(request.getServiceType())) {
            bus.setServiceType(request.getServiceType().trim());
        }
        if (request.getActive() != null) {
            bus.setActive(request.getActive());
        }

        Bus saved = busRepository.save(bus);
        return mapToResponse(saved);
    }

    @Override
    public void deleteBus(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with ID: " + id));
        busRepository.delete(bus);
    }

    private BusResponse mapToResponse(Bus bus) {
        BusResponse res = new BusResponse();
        res.setBusId(bus.getBusId());
        res.setBusNumber(bus.getBusNumber());
        res.setRouteId(bus.getRoute() != null ? bus.getRoute().getRouteId() : null);
        res.setRouteName(bus.getRoute() != null ? bus.getRoute().getRouteName() : null);
        res.setDirection(bus.getRoute() != null ? bus.getRoute().getDirection() : null);
        res.setServiceType(bus.getServiceType());
        res.setActive(bus.getActive());
        res.setSchedulesCount(bus.getSchedules() != null ? bus.getSchedules().size() : 0);
        return res;
    }
}
