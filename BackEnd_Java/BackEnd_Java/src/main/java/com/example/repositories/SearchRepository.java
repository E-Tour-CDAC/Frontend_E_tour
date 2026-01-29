package com.example.repositories;

import com.example.dto.SearchResultDTO;
import com.example.entities.TourMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
@Repository
public interface SearchRepository extends JpaRepository<TourMaster, Integer> {

    // 🔹 SEARCH BY DURATION
	@Query("""
		    SELECT new com.example.dto.SearchResultDTO(
		        t.id,
		        t.category.id,
		        t.departure.noOfDays,
		        t.departure.departDate,
		        t.departure.endDate,
		        c.singlePersonCost
		    )
		    FROM TourMaster t
		    JOIN CostMaster c ON c.category = t.category
		    WHERE t.departure.noOfDays BETWEEN :minDays AND :maxDays
		""")
		List<SearchResultDTO> searchByDuration(
		        @Param("minDays") Integer minDays,
		        @Param("maxDays") Integer maxDays
		);
	
	// 🔹 SEARCH BY LOCATION (CATEGORY NAME) ✅ FIXED
    @Query("""
        SELECT new com.example.dto.SearchResultDTO(
            t.id,
            t.category.id,
            t.departure.noOfDays,
            t.departure.departDate,
            t.departure.endDate,
            c.singlePersonCost
        )
        FROM TourMaster t
        JOIN CostMaster c ON c.category = t.category
        WHERE LOWER(t.category.categoryName)
              LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    List<SearchResultDTO> searchByLocation(
            @Param("keyword") String keyword
    );

    // 🔹 SEARCH BY COST
	@Query("""
		    SELECT new com.example.dto.SearchResultDTO(
		        t.id,
		        t.category.id,
		        t.departure.noOfDays,
		        t.departure.departDate,
		        t.departure.endDate,
		        c.singlePersonCost
		    )
		    FROM TourMaster t
		    JOIN CostMaster c ON c.category = t.category
		    WHERE c.singlePersonCost BETWEEN :minCost AND :maxCost
		""")
		List<SearchResultDTO> searchByCost(
		        @Param("minCost") BigDecimal minCost,
		        @Param("maxCost") BigDecimal maxCost
		);


    // 🔹 SEARCH BY DATE (PERIOD)
	@Query("""
		    SELECT new com.example.dto.SearchResultDTO(
		        t.id,
		        t.category.id,
		        t.departure.noOfDays,
		        t.departure.departDate,
		        t.departure.endDate,
		        c.singlePersonCost
		    )
		    FROM TourMaster t
		    JOIN CostMaster c ON c.category = t.category
		    WHERE t.departure.departDate >= :fromDate
		      AND t.departure.endDate <= :toDate
		""")
		List<SearchResultDTO> searchByDate(
		        @Param("fromDate") LocalDate fromDate,
		        @Param("toDate") LocalDate toDate
		);

}
