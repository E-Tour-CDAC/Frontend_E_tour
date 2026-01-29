package com.example.services.impl;

import com.example.dto.SearchResultDTO;
import com.example.repositories.SearchRepository;
import com.example.services.SearchService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@Service
public class SearchServiceImpl implements SearchService {

    private final SearchRepository searchRepository;

    public SearchServiceImpl(SearchRepository searchRepository) {
        this.searchRepository = searchRepository;
    }

    @Override
    public List<SearchResultDTO> searchByDuration(Integer minDays, Integer maxDays) {
        return searchRepository.searchByDuration(minDays, maxDays);
    }

    @Override
    public List<SearchResultDTO> searchByCost(BigDecimal minCost, BigDecimal maxCost) {
        return searchRepository.searchByCost(minCost, maxCost);
    }

    @Override
    public List<SearchResultDTO> searchByDate(LocalDate fromDate, LocalDate toDate) {
        return searchRepository.searchByDate(fromDate, toDate);
    }
    
    @Override
    public List<SearchResultDTO> searchByLocation(String keyword) {
        return searchRepository.searchByLocation(keyword);
    }

}
