package com.busbuddy.entity;

import jakarta.persistence.*;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "schedules")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Long scheduleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @Column(name = "departure_time", nullable = false)
    private LocalTime departureTime;

    @Column(name = "service_day", nullable = false, length = 50)
    private String serviceDay = "Daily";

    @Column(name = "source_reference", length = 150)
    private String sourceReference = "DEMO DATA: TNSTC Coimbatore";

    @Column(name = "last_verified_at")
    private LocalDateTime lastVerifiedAt;

    public Schedule() {}

    public Schedule(Long scheduleId, Bus bus, LocalTime departureTime, String serviceDay, String sourceReference, LocalDateTime lastVerifiedAt) {
        this.scheduleId = scheduleId;
        this.bus = bus;
        this.departureTime = departureTime;
        this.serviceDay = serviceDay != null ? serviceDay : "Daily";
        this.sourceReference = sourceReference != null ? sourceReference : "DEMO DATA: TNSTC Coimbatore";
        this.lastVerifiedAt = lastVerifiedAt != null ? lastVerifiedAt : LocalDateTime.now();
    }

    @PrePersist
    @PreUpdate
    public void prePersist() {
        if (this.lastVerifiedAt == null) {
            this.lastVerifiedAt = LocalDateTime.now();
        }
    }

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }

    public Bus getBus() {
        return bus;
    }

    public void setBus(Bus bus) {
        this.bus = bus;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalTime departureTime) {
        this.departureTime = departureTime;
    }

    public String getServiceDay() {
        return serviceDay;
    }

    public void setServiceDay(String serviceDay) {
        this.serviceDay = serviceDay;
    }

    public String getSourceReference() {
        return sourceReference;
    }

    public void setSourceReference(String sourceReference) {
        this.sourceReference = sourceReference;
    }

    public LocalDateTime getLastVerifiedAt() {
        return lastVerifiedAt;
    }

    public void setLastVerifiedAt(LocalDateTime lastVerifiedAt) {
        this.lastVerifiedAt = lastVerifiedAt;
    }
}
