package com.busbuddy.repository;

import com.busbuddy.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {

    List<Route> findByActiveTrue();

    List<Route> findByCityCityIdAndActiveTrue(Long cityId);

    @Query("SELECT DISTINCT r FROM Route r JOIN r.routeStops rs WHERE rs.stop.stopId = :stopId AND r.active = true")
    List<Route> findRoutesServingStop(@Param("stopId") Long stopId);

    @Query("SELECT DISTINCT r FROM Route r JOIN r.buses b WHERE LOWER(b.busNumber) LIKE LOWER(CONCAT('%', :busNumber, '%')) AND r.active = true")
    List<Route> findRoutesByBusNumber(@Param("busNumber") String busNumber);
}
