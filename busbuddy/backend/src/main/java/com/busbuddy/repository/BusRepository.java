package com.busbuddy.repository;

import com.busbuddy.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {

    List<Bus> findByActiveTrue();

    List<Bus> findByRouteRouteIdAndActiveTrue(Long routeId);

    @Query("SELECT b FROM Bus b JOIN FETCH b.route r WHERE LOWER(b.busNumber) LIKE LOWER(CONCAT('%', :number, '%')) AND b.active = true")
    List<Bus> searchByBusNumber(@Param("number") String number);

    List<Bus> findByBusNumberIgnoreCaseAndActiveTrue(String busNumber);
}
