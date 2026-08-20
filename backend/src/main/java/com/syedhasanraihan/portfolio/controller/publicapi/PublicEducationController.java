package com.syedhasanraihan.portfolio.controller.publicapi;

import com.syedhasanraihan.portfolio.dto.education.EducationResponse;
import com.syedhasanraihan.portfolio.service.EducationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/education")
@Tag(name = "Public - Education")
public class PublicEducationController {

    private final EducationService educationService;

    public PublicEducationController(EducationService educationService) {
        this.educationService = educationService;
    }

    @GetMapping
    public List<EducationResponse> list() {
        return educationService.list();
    }
}
