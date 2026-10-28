package com.busbuddy.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "stops")
public class Stop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stop_id")
    private Long stopId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    @Column(name = "stop_name_en", nullable = false, length = 150)
    private String stopNameEn;

    @Column(name = "stop_name_ta", nullable = false, length = 150)
    private String stopNameTa;

    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    public Stop() {}

    public Stop(Long stopId, City city, String stopNameEn, String stopNameTa, Double latitude, Double longitude, Boolean active) {
        this.stopId = stopId;
        this.city = city;
        this.stopNameEn = stopNameEn;
        this.stopNameTa = stopNameTa;
        this.latitude = latitude;
        this.longitude = longitude;
        this.active = active != null ? active : true;
    }

    public Long getStopId() {
        return stopId;
    }

    public void setStopId(Long stopId) {
        this.stopId = stopId;
    }

    public City getCity() {
        return city;
    }

    public void setCity(City city) {
        this.city = city;
    }

    public String getStopNameEn() {
        return stopNameEn;
    }

    public void setStopNameEn(String stopNameEn) {
        this.stopNameEn = stopNameEn;
    }

    public String getStopNameTa() {
        return stopNameTa;
    }

    public void setStopNameTa(String stopNameTa) {
        this.stopNameTa = stopNameTa;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
