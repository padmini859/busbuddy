package com.busbuddy.service.impl;

import com.busbuddy.dto.request.StopRequest;
import com.busbuddy.dto.response.StopResponse;
import com.busbuddy.entity.City;
import com.busbuddy.entity.Stop;
import com.busbuddy.exception.ResourceNotFoundException;
import com.busbuddy.repository.CityRepository;
import com.busbuddy.repository.RouteRepository;
import com.busbuddy.repository.StopRepository;
import com.busbuddy.service.StopService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StopServiceImpl implements StopService {

    private final StopRepository stopRepository;
    private final CityRepository cityRepository;
    private final RouteRepository routeRepository;

    public StopServiceImpl(StopRepository stopRepository, CityRepository cityRepository, RouteRepository routeRepository) {
        this.stopRepository = stopRepository;
        this.cityRepository = cityRepository;
        this.routeRepository = routeRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StopResponse> getAllActiveStops() {
        return stopRepository.findByActiveTrueOrderByStopNameEnAsc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StopResponse> getPopularStops() {
        List<Stop> popular = stopRepository.findPopularStops();
        if (popular.isEmpty()) {
            popular = stopRepository.findByActiveTrueOrderByStopNameEnAsc();
        }
        return popular.stream()
                .limit(8)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StopResponse> searchStops(String query) {
        if (!StringUtils.hasText(query)) {
            return getAllActiveStops();
        }
        return stopRepository.searchStops(query.trim())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public StopResponse getStopById(Long id) {
        Stop stop = stopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stop not found with ID: " + id));
        return mapToResponse(stop);
    }

    @Override
    public StopResponse createStop(StopRequest request) {
        City city = cityRepository.findById(request.getCityId())
                .orElseThrow(() -> new ResourceNotFoundException("City not found with ID: " + request.getCityId()));

        Stop stop = new Stop();
        stop.setCity(city);
        stop.setStopNameEn(request.getStopNameEn().trim());
        stop.setStopNameTa(request.getStopNameTa().trim());
        stop.setLatitude(request.getLatitude());
        stop.setLongitude(request.getLongitude());
        stop.setActive(request.getActive() != null ? request.getActive() : true);

        Stop saved = stopRepository.save(stop);
        return mapToResponse(saved);
    }

    @Override
    public StopResponse updateStop(Long id, StopRequest request) {
        Stop stop = stopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stop not found with ID: " + id));

        City city = cityRepository.findById(request.getCityId())
                .orElseThrow(() -> new ResourceNotFoundException("City not found with ID: " + request.getCityId()));

        stop.setCity(city);
        stop.setStopNameEn(request.getStopNameEn().trim());
        stop.setStopNameTa(request.getStopNameTa().trim());
        stop.setLatitude(request.getLatitude());
        stop.setLongitude(request.getLongitude());
        if (request.getActive() != null) {
            stop.setActive(request.getActive());
        }

        Stop saved = stopRepository.save(stop);
        return mapToResponse(saved);
    }

    @Override
    public void deleteStop(Long id) {
        Stop stop = stopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stop not found with ID: " + id));
        stopRepository.delete(stop);
    }

    private StopResponse mapToResponse(Stop stop) {
        StopResponse res = new StopResponse();
        res.setStopId(stop.getStopId());
        res.setCityId(stop.getCity() != null ? stop.getCity().getCityId() : null);
        res.setCityName(stop.getCity() != null ? stop.getCity().getCityName() : null);
        res.setStopNameEn(stop.getStopNameEn());
        res.setStopNameTa(stop.getStopNameTa());
        res.setLatitude(stop.getLatitude());
        res.setLongitude(stop.getLongitude());
        res.setActive(stop.getActive());
        res.setServingRoutesCount(routeRepository.findRoutesServingStop(stop.getStopId()).size());
        return res;
    }
}
