package com.busbuddy.service.impl;

import com.busbuddy.dto.request.ScheduleRequest;
import com.busbuddy.dto.response.ScheduleResponse;
import com.busbuddy.entity.Bus;
import com.busbuddy.entity.Schedule;
import com.busbuddy.exception.BadRequestException;
import com.busbuddy.exception.ResourceNotFoundException;
import com.busbuddy.repository.BusRepository;
import com.busbuddy.repository.ScheduleRepository;
import com.busbuddy.service.ScheduleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final BusRepository busRepository;

    public ScheduleServiceImpl(ScheduleRepository scheduleRepository, BusRepository busRepository) {
        this.scheduleRepository = scheduleRepository;
        this.busRepository = busRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleResponse> getAllSchedules() {
        return scheduleRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ScheduleResponse getScheduleById(Long id) {
        Schedule s = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with ID: " + id));
        return mapToResponse(s);
    }

    @Override
    public ScheduleResponse createSchedule(ScheduleRequest request) {
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with ID: " + request.getBusId()));

        LocalTime time = parseTime(request.getDepartureTime());

        Schedule s = new Schedule();
        s.setBus(bus);
        s.setDepartureTime(time);
        s.setServiceDay(request.getServiceDay() != null ? request.getServiceDay() : "Daily");
        s.setSourceReference(request.getSourceReference() != null ? request.getSourceReference() : "DEMO DATA: TNSTC Coimbatore");
        s.setLastVerifiedAt(LocalDateTime.now());

        Schedule saved = scheduleRepository.save(s);
        return mapToResponse(saved);
    }

    @Override
    public ScheduleResponse updateSchedule(Long id, ScheduleRequest request) {
        Schedule s = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with ID: " + id));

        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with ID: " + request.getBusId()));

        LocalTime time = parseTime(request.getDepartureTime());

        s.setBus(bus);
        s.setDepartureTime(time);
        if (request.getServiceDay() != null) {
            s.setServiceDay(request.getServiceDay());
        }
        if (request.getSourceReference() != null) {
            s.setSourceReference(request.getSourceReference());
        }
        s.setLastVerifiedAt(LocalDateTime.now());

        Schedule saved = scheduleRepository.save(s);
        return mapToResponse(saved);
    }

    @Override
    public void deleteSchedule(Long id) {
        Schedule s = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with ID: " + id));
        scheduleRepository.delete(s);
    }

    private LocalTime parseTime(String timeStr) {
        try {
            if (timeStr.length() == 5) {
                timeStr = timeStr + ":00";
            }
            return LocalTime.parse(timeStr);
        } catch (DateTimeParseException e) {
            throw new BadRequestException("Invalid time format. Please use HH:mm or HH:mm:ss");
        }
    }

    private ScheduleResponse mapToResponse(Schedule schedule) {
        ScheduleResponse res = new ScheduleResponse();
        res.setScheduleId(schedule.getScheduleId());
        res.setBusId(schedule.getBus() != null ? schedule.getBus().getBusId() : null);
        res.setBusNumber(schedule.getBus() != null ? schedule.getBus().getBusNumber() : null);
        res.setRouteId(schedule.getBus() != null && schedule.getBus().getRoute() != null ? schedule.getBus().getRoute().getRouteId() : null);
        res.setRouteName(schedule.getBus() != null && schedule.getBus().getRoute() != null ? schedule.getBus().getRoute().getRouteName() : null);
        res.setDepartureTime(schedule.getDepartureTime());
        res.setServiceDay(schedule.getServiceDay());
        res.setSourceReference(schedule.getSourceReference());
        res.setLastVerifiedAt(schedule.getLastVerifiedAt());
        return res;
    }
}
