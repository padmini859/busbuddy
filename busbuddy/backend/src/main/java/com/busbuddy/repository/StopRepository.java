package com.busbuddy.repository;

import com.busbuddy.entity.Stop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StopRepository extends JpaRepository<Stop, Long> {

    List<Stop> findByActiveTrueOrderByStopNameEnAsc();

    List<Stop> findByCityCityIdAndActiveTrueOrderByStopNameEnAsc(Long cityId);

    @Query("SELECT s FROM Stop s WHERE s.active = true AND " +
           "(LOWER(s.stopNameEn) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.stopNameTa) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY s.stopNameEn ASC")
    List<Stop> searchStops(@Param("query") String query);

    @Query("SELECT DISTINCT s FROM Stop s JOIN RouteStop rs ON rs.stop.stopId = s.stopId " +
           "JOIN Route r ON rs.route.routeId = r.routeId " +
           "WHERE s.active = true AND r.active = true " +
           "GROUP BY s.stopId ORDER BY COUNT(rs.route.routeId) DESC")
    List<Stop> findPopularStops();
}
