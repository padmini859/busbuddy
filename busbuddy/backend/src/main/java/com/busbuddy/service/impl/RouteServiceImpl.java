package com.busbuddy.service.impl;

import com.busbuddy.dto.request.RouteRequest;
import com.busbuddy.dto.response.*;
import com.busbuddy.entity.*;
import com.busbuddy.exception.BadRequestException;
import com.busbuddy.exception.ResourceNotFoundException;
import com.busbuddy.repository.*;
import com.busbuddy.service.RouteService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class RouteServiceImpl implements RouteService {

    private final RouteRepository routeRepository;
    private final RouteStopRepository routeStopRepository;
    private final StopRepository stopRepository;
    private final CityRepository cityRepository;
    private final BusRepository busRepository;
    private final ScheduleRepository scheduleRepository;
    private final FareRepository fareRepository;

    public RouteServiceImpl(RouteRepository routeRepository,
                            RouteStopRepository routeStopRepository,
                            StopRepository stopRepository,
                            CityRepository cityRepository,
                            BusRepository busRepository,
                            ScheduleRepository scheduleRepository,
                            FareRepository fareRepository) {
        this.routeRepository = routeRepository;
        this.routeStopRepository = routeStopRepository;
        this.stopRepository = stopRepository;
        this.cityRepository = cityRepository;
        this.busRepository = busRepository;
        this.scheduleRepository = scheduleRepository;
        this.fareRepository = fareRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public RouteSearchResponse searchRoutes(Long sourceStopId, Long destinationStopId) {
        // 1. Validation
        if (sourceStopId == null || destinationStopId == null) {
            throw new BadRequestException("Source and destination stop IDs are required");
        }
        if (sourceStopId.equals(destinationStopId)) {
            throw new BadRequestException("Source and destination stops cannot be identical");
        }

        Stop sourceStop = stopRepository.findById(sourceStopId)
                .orElseThrow(() -> new ResourceNotFoundException("Source stop not found with ID: " + sourceStopId));
        Stop destStop = stopRepository.findById(destinationStopId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination stop not found with ID: " + destinationStopId));

        StopResponse sourceRes = mapStopToResponse(sourceStop);
        StopResponse destRes = mapStopToResponse(destStop);

        // 2. Direct Routes Search
        List<DirectRouteSearchResult> directRoutes = findDirectRoutes(sourceStop, destStop);

        // 3. Connecting Routes Search (1 transfer)
        List<ConnectingRouteSearchResult> connectingRoutes = findConnectingRoutes(sourceStop, destStop, directRoutes);

        return new RouteSearchResponse(sourceRes, destRes, directRoutes, connectingRoutes);
    }

    private List<DirectRouteSearchResult> findDirectRoutes(Stop sourceStop, Stop destStop) {
        List<DirectRouteSearchResult> results = new ArrayList<>();

        List<RouteStop> sourceStops = routeStopRepository.findActiveByStopId(sourceStop.getStopId());

        for (RouteStop rsSource : sourceStops) {
            Route route = rsSource.getRoute();
            Optional<RouteStop> rsDestOpt = routeStopRepository.findByRouteRouteIdAndStopStopId(route.getRouteId(), destStop.getStopId());

            if (rsDestOpt.isPresent()) {
                RouteStop rsDest = rsDestOpt.get();
                // Condition: Direction check - source must precede destination
                if (rsSource.getStopOrder() < rsDest.getStopOrder()) {
                    DirectRouteSearchResult direct = buildDirectResult(route, rsSource, rsDest);
                    results.add(direct);
                }
            }
        }

        // Sort by fewest intermediate stops
        results.sort(Comparator.comparingInt(DirectRouteSearchResult::getIntermediateStopsCount));
        return results;
    }

    private List<ConnectingRouteSearchResult> findConnectingRoutes(
            Stop sourceStop, Stop destStop, List<DirectRouteSearchResult> directRoutes) {

        List<ConnectingRouteSearchResult> connectingResults = new ArrayList<>();
        Set<String> seenJourneyKeys = new HashSet<>();

        // If direct routes exist, we record their route IDs to prioritize alternative options
        Set<Long> directRouteIds = directRoutes.stream()
                .map(DirectRouteSearchResult::getRouteId)
                .collect(Collectors.toSet());

        // Find all active routes from source
        List<RouteStop> sourceStops = routeStopRepository.findActiveByStopId(sourceStop.getStopId());

        for (RouteStop rsSource : sourceStops) {
            Route leg1Route = rsSource.getRoute();
            // Get all stops on Leg 1 that appear after the source stop
            List<RouteStop> allLeg1Stops = routeStopRepository.findByRouteRouteIdOrderByStopOrderAsc(leg1Route.getRouteId());

            List<RouteStop> candidateTransferStops = allLeg1Stops.stream()
                    .filter(rs -> rs.getStopOrder() > rsSource.getStopOrder())
                    .toList();

            for (RouteStop rsTransferLeg1 : candidateTransferStops) {
                Stop transferStop = rsTransferLeg1.getStop();
                Long transferStopId = transferStop.getStopId();

                // Transfer stop cannot be source or destination
                if (transferStopId.equals(sourceStop.getStopId()) || transferStopId.equals(destStop.getStopId())) {
                    continue;
                }

                // Find all active routes from the transfer stop
                List<RouteStop> transferStopsLeg2 = routeStopRepository.findActiveByStopId(transferStopId);

                for (RouteStop rsTransferLeg2 : transferStopsLeg2) {
                    Route leg2Route = rsTransferLeg2.getRoute();

                    // Must be a different route to constitute a valid transfer
                    if (leg1Route.getRouteId().equals(leg2Route.getRouteId())) {
                        continue;
                    }

                    // Check if leg2 reaches destination
                    Optional<RouteStop> rsDestOpt = routeStopRepository.findByRouteRouteIdAndStopStopId(
                            leg2Route.getRouteId(), destStop.getStopId());

                    if (rsDestOpt.isPresent()) {
                        RouteStop rsDest = rsDestOpt.get();

                        // Leg 2 direction check: transfer stop must precede destination stop
                        if (rsTransferLeg2.getStopOrder() < rsDest.getStopOrder()) {
                            // Prevent circular routes: source stop should not be visited on Leg 2
                            Optional<RouteStop> sourceInLeg2 = routeStopRepository.findByRouteRouteIdAndStopStopId(
                                    leg2Route.getRouteId(), sourceStop.getStopId());
                            if (sourceInLeg2.isPresent() && sourceInLeg2.get().getStopOrder() < rsDest.getStopOrder()) {
                                // Circular journey or redundant transfer
                                continue;
                            }

                            // Duplicate journey check (Route1-TransferStop-Route2)
                            String journeyKey = leg1Route.getRouteId() + "-" + transferStopId + "-" + leg2Route.getRouteId();
                            if (seenJourneyKeys.contains(journeyKey)) {
                                continue;
                            }
                            seenJourneyKeys.add(journeyKey);

                            DirectRouteSearchResult leg1 = buildDirectResult(leg1Route, rsSource, rsTransferLeg1);
                            DirectRouteSearchResult leg2 = buildDirectResult(leg2Route, rsTransferLeg2, rsDest);

                            StopResponse transferStopRes = mapStopToResponse(transferStop);
                            ConnectingRouteSearchResult connResult = new ConnectingRouteSearchResult(leg1, leg2, transferStopRes);
                            connectingResults.add(connResult);
                        }
                    }
                }
            }
        }

        // Sort connecting routes by total intermediate stops
        connectingResults.sort(Comparator.comparingInt(ConnectingRouteSearchResult::getTotalIntermediateStops));

        // Limit results to top 10 most relevant connections
        return connectingResults.stream().limit(10).collect(Collectors.toList());
    }

    private DirectRouteSearchResult buildDirectResult(Route route, RouteStop rsBoarding, RouteStop rsDest) {
        DirectRouteSearchResult res = new DirectRouteSearchResult();
        res.setRouteId(route.getRouteId());
        res.setRouteName(route.getRouteName());
        res.setDirection(route.getDirection());
        res.setLastVerifiedAt(route.getLastVerifiedAt());

        res.setBoardingStop(mapStopToResponse(rsBoarding.getStop()));
        res.setDestinationStop(mapStopToResponse(rsDest.getStop()));

        // Intermediate stops (inclusive of boarding and destination)
        List<RouteStop> allStops = routeStopRepository.findByRouteRouteIdOrderByStopOrderAsc(route.getRouteId());
        List<StopResponse> intermediate = allStops.stream()
                .filter(rs -> rs.getStopOrder() >= rsBoarding.getStopOrder() && rs.getStopOrder() <= rsDest.getStopOrder())
                .map(rs -> mapStopToResponse(rs.getStop()))
                .collect(Collectors.toList());

        res.setIntermediateStops(intermediate);
        res.setIntermediateStopsCount(Math.max(0, intermediate.size() - 2));

        // Buses
        List<Bus> buses = busRepository.findByRouteRouteIdAndActiveTrue(route.getRouteId());
        List<String> busNumbers = buses.stream().map(Bus::getBusNumber).distinct().collect(Collectors.toList());
        res.setBusNumbers(busNumbers);

        String serviceType = buses.isEmpty() ? "Ordinary" : buses.get(0).getServiceType();
        res.setServiceType(serviceType);

        // Schedules
        List<Schedule> schedules = scheduleRepository.findByRouteId(route.getRouteId());
        List<ScheduleResponse> scheduleResponses = schedules.stream()
                .map(this::mapScheduleToResponse)
                .collect(Collectors.toList());
        res.setScheduledDepartures(scheduleResponses);

        // Fare lookup
        Optional<Fare> fareOpt = fareRepository.findFareForLeg(
                route.getRouteId(), rsBoarding.getStop().getStopId(), rsDest.getStop().getStopId());
        if (fareOpt.isPresent()) {
            res.setFareAmount(fareOpt.get().getAmount());
        } else {
            // Default calculated fare slab based on stop count
            int count = Math.max(1, intermediate.size() - 1);
            BigDecimal estimatedFare = BigDecimal.valueOf(Math.min(30, 5 + (count * 2.50)));
            res.setFareAmount(estimatedFare);
        }

        return res;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RouteResponse> getAllRoutes() {
        return routeRepository.findAll().stream()
                .map(this::mapToRouteResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RouteDetailResponse getRouteDetail(Long routeId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + routeId));

        RouteDetailResponse res = new RouteDetailResponse();
        res.setRouteId(route.getRouteId());
        res.setCityId(route.getCity() != null ? route.getCity().getCityId() : null);
        res.setCityName(route.getCity() != null ? route.getCity().getCityName() : null);
        res.setRouteName(route.getRouteName());
        res.setDirection(route.getDirection());
        res.setActive(route.getActive());
        res.setLastVerifiedAt(route.getLastVerifiedAt());

        List<RouteStop> routeStops = routeStopRepository.findByRouteRouteIdOrderByStopOrderAsc(routeId);
        List<StopResponse> stops = routeStops.stream()
                .map(rs -> mapStopToResponse(rs.getStop()))
                .collect(Collectors.toList());
        res.setStops(stops);

        List<Bus> buses = busRepository.findByRouteRouteIdAndActiveTrue(routeId);
        res.setBuses(buses.stream().map(this::mapBusToResponse).collect(Collectors.toList()));

        List<Schedule> schedules = scheduleRepository.findByRouteId(routeId);
        res.setSchedules(schedules.stream().map(this::mapScheduleToResponse).collect(Collectors.toList()));

        return res;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StopResponse> getRouteStops(Long routeId) {
        List<RouteStop> routeStops = routeStopRepository.findByRouteRouteIdOrderByStopOrderAsc(routeId);
        return routeStops.stream()
                .map(rs -> mapStopToResponse(rs.getStop()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleResponse> getRouteSchedules(Long routeId) {
        return scheduleRepository.findByRouteId(routeId).stream()
                .map(this::mapScheduleToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RouteDetailResponse createRoute(RouteRequest request) {
        City city = cityRepository.findById(request.getCityId())
                .orElseThrow(() -> new ResourceNotFoundException("City not found with ID: " + request.getCityId()));

        Route route = new Route();
        route.setCity(city);
        route.setRouteName(request.getRouteName().trim());
        route.setDirection(request.getDirection().trim());
        route.setActive(request.getActive() != null ? request.getActive() : true);
        route.setLastVerifiedAt(LocalDateTime.now());

        Route saved = routeRepository.save(route);

        if (request.getStopIds() != null && !request.getStopIds().isEmpty()) {
            int order = 1;
            for (Long stopId : request.getStopIds()) {
                Stop stop = stopRepository.findById(stopId)
                        .orElseThrow(() -> new ResourceNotFoundException("Stop not found with ID: " + stopId));
                RouteStop rs = new RouteStop(null, saved, stop, order++);
                routeStopRepository.save(rs);
            }
        }

        return getRouteDetail(saved.getRouteId());
    }

    @Override
    public RouteDetailResponse updateRoute(Long routeId, RouteRequest request) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + routeId));

        City city = cityRepository.findById(request.getCityId())
                .orElseThrow(() -> new ResourceNotFoundException("City not found with ID: " + request.getCityId()));

        route.setCity(city);
        route.setRouteName(request.getRouteName().trim());
        route.setDirection(request.getDirection().trim());
        if (request.getActive() != null) {
            route.setActive(request.getActive());
        }
        route.setLastVerifiedAt(LocalDateTime.now());
        Route saved = routeRepository.save(route);

        if (request.getStopIds() != null) {
            routeStopRepository.deleteByRouteRouteId(routeId);
            int order = 1;
            for (Long stopId : request.getStopIds()) {
                Stop stop = stopRepository.findById(stopId)
                        .orElseThrow(() -> new ResourceNotFoundException("Stop not found with ID: " + stopId));
                RouteStop rs = new RouteStop(null, saved, stop, order++);
                routeStopRepository.save(rs);
            }
        }

        return getRouteDetail(saved.getRouteId());
    }

    @Override
    public void deleteRoute(Long routeId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + routeId));
        routeRepository.delete(route);
    }

    private StopResponse mapStopToResponse(Stop stop) {
        StopResponse res = new StopResponse();
        res.setStopId(stop.getStopId());
        res.setCityId(stop.getCity() != null ? stop.getCity().getCityId() : null);
        res.setCityName(stop.getCity() != null ? stop.getCity().getCityName() : null);
        res.setStopNameEn(stop.getStopNameEn());
        res.setStopNameTa(stop.getStopNameTa());
        res.setLatitude(stop.getLatitude());
        res.setLongitude(stop.getLongitude());
        res.setActive(stop.getActive());
        return res;
    }

    private RouteResponse mapToRouteResponse(Route route) {
        RouteResponse res = new RouteResponse();
        res.setRouteId(route.getRouteId());
        res.setCityId(route.getCity() != null ? route.getCity().getCityId() : null);
        res.setCityName(route.getCity() != null ? route.getCity().getCityName() : null);
        res.setRouteName(route.getRouteName());
        res.setDirection(route.getDirection());
        res.setActive(route.getActive());
        res.setLastVerifiedAt(route.getLastVerifiedAt());

        List<RouteStop> routeStops = routeStopRepository.findByRouteRouteIdOrderByStopOrderAsc(route.getRouteId());
        res.setTotalStops(routeStops.size());
        if (!routeStops.isEmpty()) {
            res.setStartingStopName(routeStops.get(0).getStop().getStopNameEn());
            res.setEndingStopName(routeStops.get(routeStops.size() - 1).getStop().getStopNameEn());
        }

        List<Bus> buses = busRepository.findByRouteRouteIdAndActiveTrue(route.getRouteId());
        res.setBusNumbers(buses.stream().map(Bus::getBusNumber).distinct().collect(Collectors.toList()));
        return res;
    }

    private BusResponse mapBusToResponse(Bus bus) {
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

    private ScheduleResponse mapScheduleToResponse(Schedule schedule) {
        ScheduleResponse res = new ScheduleResponse();
        res.setScheduleId(schedule.getScheduleId());
        res.setBusId(schedule.getBus() != null ? schedule.getBus().getBusId() : null);
        res.setBusNumber(schedule.getBus() != null ? schedule.getBus().getBusNumber() : null);
        res.setRouteId(schedule.getBus() != null && schedule.getBus().getRoute() != null ? schedule.getBus().getRoute().getRouteId() : null);
        res.setRouteName(schedule.getBus() != null && schedule.getBus().getRoute() != null ? schedule.getBus().getRoute().getRouteName() : null);
        res.setDepartureTime(schedule.getDepartureTime());
        res.setServiceDay(schedule.getServiceDay());
        res.setSourceReference(schedule.getSourceReference());
        res.setLastVerifiedAt(schedule.getLastVerifiedAt());
        return res;
    }
}
