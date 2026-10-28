package com.busbuddy.service.impl;

import com.busbuddy.dto.request.FareRequest;
import com.busbuddy.dto.response.FareResponse;
import com.busbuddy.entity.Fare;
import com.busbuddy.entity.Route;
import com.busbuddy.entity.Stop;
import com.busbuddy.exception.ResourceNotFoundException;
import com.busbuddy.repository.FareRepository;
import com.busbuddy.repository.RouteRepository;
import com.busbuddy.repository.StopRepository;
import com.busbuddy.service.FareService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FareServiceImpl implements FareService {

    private final FareRepository fareRepository;
    private final RouteRepository routeRepository;
    private final StopRepository stopRepository;

    public FareServiceImpl(FareRepository fareRepository, RouteRepository routeRepository, StopRepository stopRepository) {
        this.fareRepository = fareRepository;
        this.routeRepository = routeRepository;
        this.stopRepository = stopRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FareResponse> getAllFares() {
        return fareRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public FareResponse getFareById(Long id) {
        Fare fare = fareRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fare not found with ID: " + id));
        return mapToResponse(fare);
    }

    @Override
    public FareResponse createFare(FareRequest request) {
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + request.getRouteId()));
        Stop source = stopRepository.findById(request.getSourceStopId())
                .orElseThrow(() -> new ResourceNotFoundException("Source stop not found with ID: " + request.getSourceStopId()));
        Stop dest = stopRepository.findById(request.getDestinationStopId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination stop not found with ID: " + request.getDestinationStopId()));

        Fare fare = new Fare();
        fare.setRoute(route);
        fare.setSourceStop(source);
        fare.setDestinationStop(dest);
        fare.setAmount(request.getAmount());
        fare.setFareType(request.getFareType() != null ? request.getFareType() : "Regular");
        fare.setLastVerifiedAt(LocalDateTime.now());

        Fare saved = fareRepository.save(fare);
        return mapToResponse(saved);
    }

    @Override
    public FareResponse updateFare(Long id, FareRequest request) {
        Fare fare = fareRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fare not found with ID: " + id));

        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + request.getRouteId()));
        Stop source = stopRepository.findById(request.getSourceStopId())
                .orElseThrow(() -> new ResourceNotFoundException("Source stop not found with ID: " + request.getSourceStopId()));
        Stop dest = stopRepository.findById(request.getDestinationStopId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination stop not found with ID: " + request.getDestinationStopId()));

        fare.setRoute(route);
        fare.setSourceStop(source);
        fare.setDestinationStop(dest);
        fare.setAmount(request.getAmount());
        if (request.getFareType() != null) {
            fare.setFareType(request.getFareType());
        }
        fare.setLastVerifiedAt(LocalDateTime.now());

        Fare saved = fareRepository.save(fare);
        return mapToResponse(saved);
    }

    @Override
    public void deleteFare(Long id) {
        Fare fare = fareRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fare not found with ID: " + id));
        fareRepository.delete(fare);
    }

    private FareResponse mapToResponse(Fare fare) {
        FareResponse res = new FareResponse();
        res.setFareId(fare.getFareId());
        res.setRouteId(fare.getRoute() != null ? fare.getRoute().getRouteId() : null);
        res.setRouteName(fare.getRoute() != null ? fare.getRoute().getRouteName() : null);
        res.setSourceStopId(fare.getSourceStop() != null ? fare.getSourceStop().getStopId() : null);
        res.setSourceStopName(fare.getSourceStop() != null ? fare.getSourceStop().getStopNameEn() : null);
        res.setDestinationStopId(fare.getDestinationStop() != null ? fare.getDestinationStop().getStopId() : null);
        res.setDestinationStopName(fare.getDestinationStop() != null ? fare.getDestinationStop().getStopNameEn() : null);
        res.setAmount(fare.getAmount());
        res.setFareType(fare.getFareType());
        res.setLastVerifiedAt(fare.getLastVerifiedAt());
        return res;
    }
}
