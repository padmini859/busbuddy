package com.busbuddy;

import com.busbuddy.dto.response.DirectRouteSearchResult;
import com.busbuddy.dto.response.RouteSearchResponse;
import com.busbuddy.entity.City;
import com.busbuddy.entity.Route;
import com.busbuddy.entity.RouteStop;
import com.busbuddy.entity.Stop;
import com.busbuddy.exception.BadRequestException;
import com.busbuddy.exception.ResourceNotFoundException;
import com.busbuddy.repository.*;
import com.busbuddy.service.impl.RouteServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RouteSearchServiceTest {

    @Mock
    private RouteRepository routeRepository;

    @Mock
    private RouteStopRepository routeStopRepository;

    @Mock
    private StopRepository stopRepository;

    @Mock
    private CityRepository cityRepository;

    @Mock
    private BusRepository busRepository;

    @Mock
    private ScheduleRepository scheduleRepository;

    @Mock
    private FareRepository fareRepository;

    @InjectMocks
    private RouteServiceImpl routeService;

    private City testCity;
    private Stop stopA;
    private Stop stopB;
    private Stop stopC;
    private Stop stopD;
    private Route route1; // A -> B -> C
    private Route route2; // C -> D

    @BeforeEach
    void setUp() {
        testCity = new City(1L, "Coimbatore", "Tamil Nadu");

        stopA = new Stop(1L, testCity, "Gandhipuram", "காந்திபுரம்", 11.0168, 76.9678, true);
        stopB = new Stop(2L, testCity, "Town Hall", "டவுன் ஹால்", 10.9950, 76.9610, true);
        stopC = new Stop(3L, testCity, "Ukkadam", "உக்கடம்", 10.9890, 76.9580, true);
        stopD = new Stop(4L, testCity, "Eachanari", "ஈச்சனாரி", 10.9320, 76.9690, true);

        route1 = new Route(10L, testCity, "11A: Gandhipuram to Ukkadam", "UP", true, null);
        route2 = new Route(20L, testCity, "20C: Ukkadam to Eachanari", "UP", true, null);
    }

    @Test
    @DisplayName("Direct Route Search: Should return direct route when source precedes destination")
    void testDirectRouteSearch_Success() {
        when(stopRepository.findById(1L)).thenReturn(Optional.of(stopA));
        when(stopRepository.findById(3L)).thenReturn(Optional.of(stopC));

        RouteStop rsA = new RouteStop(101L, route1, stopA, 1);
        RouteStop rsB = new RouteStop(102L, route1, stopB, 2);
        RouteStop rsC = new RouteStop(103L, route1, stopC, 3);

        when(routeStopRepository.findActiveByStopId(1L)).thenReturn(List.of(rsA));
        when(routeStopRepository.findByRouteRouteIdAndStopStopId(10L, 3L)).thenReturn(Optional.of(rsC));
        when(routeStopRepository.findByRouteRouteIdOrderByStopOrderAsc(10L)).thenReturn(List.of(rsA, rsB, rsC));
        when(busRepository.findByRouteRouteIdAndActiveTrue(10L)).thenReturn(Collections.emptyList());
        when(scheduleRepository.findByRouteId(10L)).thenReturn(Collections.emptyList());

        RouteSearchResponse response = routeService.searchRoutes(1L, 3L);

        assertNotNull(response);
        assertEquals(1, response.getTotalDirectRoutes());
        DirectRouteSearchResult direct = response.getDirectRoutes().get(0);
        assertEquals("11A: Gandhipuram to Ukkadam", direct.getRouteName());
        assertEquals(1, direct.getIntermediateStopsCount()); // Town Hall is the only intermediate stop
        assertEquals("Town Hall", direct.getIntermediateStops().get(1).getStopNameEn());
    }

    @Test
    @DisplayName("Reverse Direction Check: Should reject route if destination precedes source order")
    void testReverseDirection_Rejected() {
        when(stopRepository.findById(3L)).thenReturn(Optional.of(stopC));
        when(stopRepository.findById(1L)).thenReturn(Optional.of(stopA));

        RouteStop rsC = new RouteStop(103L, route1, stopC, 3);
        RouteStop rsA = new RouteStop(101L, route1, stopA, 1);

        // Searching from C (order 3) to A (order 1) on route1 (forward route)
        when(routeStopRepository.findActiveByStopId(3L)).thenReturn(List.of(rsC));
        when(routeStopRepository.findByRouteRouteIdAndStopStopId(10L, 1L)).thenReturn(Optional.of(rsA));
        when(routeStopRepository.findByRouteRouteIdOrderByStopOrderAsc(10L)).thenReturn(List.of(rsA, rsC));

        RouteSearchResponse response = routeService.searchRoutes(3L, 1L);

        assertNotNull(response);
        assertEquals(0, response.getTotalDirectRoutes());
    }

    @Test
    @DisplayName("Connecting Route Search: Should identify 1-transfer connection via transfer stop")
    void testConnectingRouteSearch_Success() {
        // Searching from Stop A (Gandhipuram) to Stop D (Eachanari)
        // Leg 1: Route 1 (A -> C)
        // Leg 2: Route 2 (C -> D)
        // Transfer Stop: Stop C (Ukkadam)
        when(stopRepository.findById(1L)).thenReturn(Optional.of(stopA));
        when(stopRepository.findById(4L)).thenReturn(Optional.of(stopD));

        RouteStop rsA = new RouteStop(101L, route1, stopA, 1);
        RouteStop rsC1 = new RouteStop(103L, route1, stopC, 2);

        RouteStop rsC2 = new RouteStop(201L, route2, stopC, 1);
        RouteStop rsD = new RouteStop(202L, route2, stopD, 2);

        // Direct search returns empty
        when(routeStopRepository.findActiveByStopId(1L)).thenReturn(List.of(rsA));
        when(routeStopRepository.findByRouteRouteIdAndStopStopId(10L, 4L)).thenReturn(Optional.empty());

        // Connecting search
        when(routeStopRepository.findByRouteRouteIdOrderByStopOrderAsc(10L)).thenReturn(List.of(rsA, rsC1));
        when(routeStopRepository.findActiveByStopId(3L)).thenReturn(List.of(rsC2));
        when(routeStopRepository.findByRouteRouteIdAndStopStopId(20L, 4L)).thenReturn(Optional.of(rsD));
        when(routeStopRepository.findByRouteRouteIdAndStopStopId(20L, 1L)).thenReturn(Optional.empty()); // No loop
        when(routeStopRepository.findByRouteRouteIdOrderByStopOrderAsc(20L)).thenReturn(List.of(rsC2, rsD));

        when(busRepository.findByRouteRouteIdAndActiveTrue(anyLong())).thenReturn(Collections.emptyList());
        when(scheduleRepository.findByRouteId(anyLong())).thenReturn(Collections.emptyList());

        RouteSearchResponse response = routeService.searchRoutes(1L, 4L);

        assertNotNull(response);
        assertEquals(0, response.getTotalDirectRoutes());
        assertEquals(1, response.getTotalConnectingRoutes());

        var connecting = response.getConnectingRoutes().get(0);
        assertEquals("Ukkadam", connecting.getTransferStop().getStopNameEn());
        assertEquals("11A: Gandhipuram to Ukkadam", connecting.getFirstLeg().getRouteName());
        assertEquals("20C: Ukkadam to Eachanari", connecting.getSecondLeg().getRouteName());
    }

    @Test
    @DisplayName("Validation: Should reject identical source and destination")
    void testIdenticalStops_ThrowsBadRequest() {
        assertThrows(BadRequestException.class, () -> routeService.searchRoutes(1L, 1L));
    }

    @Test
    @DisplayName("Validation: Should reject non-existent stop")
    void testNonExistentStop_ThrowsNotFound() {
        when(stopRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> routeService.searchRoutes(999L, 2L));
    }
}
