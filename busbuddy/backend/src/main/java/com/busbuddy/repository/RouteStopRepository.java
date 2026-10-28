package com.busbuddy.repository;

import com.busbuddy.entity.RouteStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteStopRepository extends JpaRepository<RouteStop, Long> {

    List<RouteStop> findByRouteRouteIdOrderByStopOrderAsc(Long routeId);

    List<RouteStop> findByStopStopId(Long stopId);

    Optional<RouteStop> findByRouteRouteIdAndStopStopId(Long routeId, Long stopId);

    @Query("SELECT rs FROM RouteStop rs JOIN FETCH rs.route r WHERE rs.stop.stopId = :stopId AND r.active = true")
    List<RouteStop> findActiveByStopId(@Param("stopId") Long stopId);

    void deleteByRouteRouteId(Long routeId);
}
