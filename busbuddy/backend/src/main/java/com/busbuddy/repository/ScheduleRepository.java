package com.busbuddy.repository;

import com.busbuddy.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    List<Schedule> findByBusBusIdOrderByDepartureTimeAsc(Long busId);

    @Query("SELECT s FROM Schedule s JOIN s.bus b WHERE b.route.routeId = :routeId AND b.active = true ORDER BY s.departureTime ASC")
    List<Schedule> findByRouteId(@Param("routeId") Long routeId);

    void deleteByBusBusId(Long busId);
}
