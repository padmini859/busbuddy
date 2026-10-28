package com.busbuddy.service;

import com.busbuddy.entity.City;
import java.util.List;

public interface CityService {
    List<City> getAllCities();
    City getCityById(Long id);
    City createCity(City city);
    City updateCity(Long id, City city);
    void deleteCity(Long id);
}
