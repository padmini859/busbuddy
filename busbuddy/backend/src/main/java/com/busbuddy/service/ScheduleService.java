package com.busbuddy.service;

import com.busbuddy.dto.request.ScheduleRequest;
import com.busbuddy.dto.response.ScheduleResponse;
import java.util.List;

public interface ScheduleService {
    List<ScheduleResponse> getAllSchedules();
    ScheduleResponse getScheduleById(Long id);
    ScheduleResponse createSchedule(ScheduleRequest request);
    ScheduleResponse updateSchedule(Long id, ScheduleRequest request);
    void deleteSchedule(Long id);
}
