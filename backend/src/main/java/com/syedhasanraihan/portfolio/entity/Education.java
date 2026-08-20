package com.syedhasanraihan.portfolio.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "education")
@Getter
@Setter
@NoArgsConstructor
public class Education {

    public enum DatePrecision {
        YEAR, MONTH_YEAR, FULL
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String institution;

    @Column(nullable = false)
    private String degree;

    private String field;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "date_precision", nullable = false)
    private DatePrecision datePrecision = DatePrecision.FULL;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "order_index", nullable = false)
    private int orderIndex;
}
