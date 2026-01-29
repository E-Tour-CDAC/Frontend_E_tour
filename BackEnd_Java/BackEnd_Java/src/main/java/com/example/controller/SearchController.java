package com.example.controller;

import com.example.dto.SearchResultDTO;
import com.example.services.SearchService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/search")
@CrossOrigin(origins = "http://localhost:5137")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    // 🔹 BY DURATION
    @GetMapping("/by-duration")
    public List<SearchResultDTO> searchByDuration(
            @RequestParam Integer minDays,
            @RequestParam Integer maxDays
    ) {
        return searchService.searchByDuration(minDays, maxDays);
    }

    // 🔹 BY COST
    @GetMapping("/by-cost")
    public List<SearchResultDTO> searchByCost(
            @RequestParam BigDecimal minCost,
            @RequestParam BigDecimal maxCost
    ) {
        return searchService.searchByCost(minCost, maxCost);
    }
    
    @GetMapping("/by-location")
    public List<SearchResultDTO> searchByLocation(
            @RequestParam String keyword
    ) {
        return searchService.searchByLocation(keyword);
    }


    // 🔹 BY DATE (PERIOD)
    @GetMapping("/by-date")
    public List<SearchResultDTO> searchByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return searchService.searchByDate(fromDate, toDate);
    }
}
