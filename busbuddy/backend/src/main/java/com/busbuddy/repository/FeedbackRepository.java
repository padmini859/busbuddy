package com.busbuddy.repository;

import com.busbuddy.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findAllByOrderByCreatedAtDesc();

    List<Feedback> findByStatusOrderByCreatedAtDesc(String status);

    long countByStatus(String status);
}
