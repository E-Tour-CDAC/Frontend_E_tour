package com.example.services;

import com.example.dto.SearchResultDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface SearchService {

    List<SearchResultDTO> searchByDuration(Integer minDays, Integer maxDays);

    List<SearchResultDTO> searchByCost(BigDecimal minCost, BigDecimal maxCost);

    List<SearchResultDTO> searchByDate(LocalDate fromDate, LocalDate toDate);
    
    List<SearchResultDTO> searchByLocation(String keyword);

}
