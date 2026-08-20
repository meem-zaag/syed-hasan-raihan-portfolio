package com.syedhasanraihan.portfolio.controller.admin;

import com.syedhasanraihan.portfolio.dto.education.EducationRequest;
import com.syedhasanraihan.portfolio.dto.education.EducationResponse;
import com.syedhasanraihan.portfolio.service.EducationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/education")
@Tag(name = "Admin - Education")
@SecurityRequirement(name = "bearerAuth")
public class AdminEducationController {

    private final EducationService educationService;

    public AdminEducationController(EducationService educationService) {
        this.educationService = educationService;
    }

    @GetMapping
    public List<EducationResponse> list() {
        return educationService.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EducationResponse create(@Valid @RequestBody EducationRequest request) {
        return educationService.create(request);
    }

    @PutMapping("/{id}")
    public EducationResponse update(@PathVariable Long id, @Valid @RequestBody EducationRequest request) {
        return educationService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        educationService.delete(id);
    }
}
