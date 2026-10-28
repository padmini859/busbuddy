package com.busbuddy.service.impl;

import com.busbuddy.entity.City;
import com.busbuddy.exception.ResourceNotFoundException;
import com.busbuddy.repository.CityRepository;
import com.busbuddy.service.CityService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CityServiceImpl implements CityService {

    private final CityRepository cityRepository;

    public CityServiceImpl(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<City> getAllCities() {
        return cityRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public City getCityById(Long id) {
        return cityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("City not found with ID: " + id));
    }

    @Override
    public City createCity(City city) {
        return cityRepository.save(city);
    }

    @Override
    public City updateCity(Long id, City updated) {
        City existing = getCityById(id);
        existing.setCityName(updated.getCityName());
        existing.setStateName(updated.getStateName());
        return cityRepository.save(existing);
    }

    @Override
    public void deleteCity(Long id) {
        City existing = getCityById(id);
        cityRepository.delete(existing);
    }
}
