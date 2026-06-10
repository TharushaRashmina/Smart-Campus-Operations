package com.example.smart_campus_operations.repository;

import com.example.smart_campus_operations.entity.IncidentTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface IncidentTicketRepository extends JpaRepository<IncidentTicket, Long>, JpaSpecificationExecutor<IncidentTicket> {
    Optional<IncidentTicket> findTopByOrderByIdDesc();
}

