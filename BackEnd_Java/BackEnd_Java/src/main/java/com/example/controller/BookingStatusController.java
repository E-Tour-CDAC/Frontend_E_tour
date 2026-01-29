package com.example.controller;

import java.util.List;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.BookingStatusDTO;
import com.example.services.BookingStatusService;


@RestController
@RequestMapping("/api/booking-status")
public class BookingStatusController {


    private final BookingStatusService bookingStatusService;

    public BookingStatusController(BookingStatusService bookingStatusService) {
        this.bookingStatusService = bookingStatusService;
    }

    @GetMapping
    public List<BookingStatusDTO> getAllStatues(){
        return bookingStatusService.getAllStatuses();
    }


    @GetMapping("/{statusId}")
    public BookingStatusDTO getStatusById(@PathVariable Integer statusId) {
        return bookingStatusService.getStatusById(statusId);
    }


}

