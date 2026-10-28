package com.busbuddy.repository;

import com.busbuddy.entity.Fare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FareRepository extends JpaRepository<Fare, Long> {

    List<Fare> findByRouteRouteId(Long routeId);

    @Query("SELECT f FROM Fare f WHERE f.route.routeId = :routeId AND f.sourceStop.stopId = :sourceId AND f.destinationStop.stopId = :destId")
    Optional<Fare> findFareForLeg(@Param("routeId") Long routeId, @Param("sourceId") Long sourceId, @Param("destId") Long destId);

    @Query("SELECT f FROM Fare f WHERE f.sourceStop.stopId = :sourceId AND f.destinationStop.stopId = :destId")
    List<Fare> findFaresBetweenStops(@Param("sourceId") Long sourceId, @Param("destId") Long destId);
}
