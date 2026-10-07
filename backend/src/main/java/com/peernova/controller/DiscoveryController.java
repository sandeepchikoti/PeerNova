package com.peernova.controller;

import com.peernova.dto.ApiResponse;
import com.peernova.dto.StudentDiscoveryResponse;
import com.peernova.service.DiscoveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/discovery")
public class DiscoveryController {

    @Autowired
    private DiscoveryService discoveryService;

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<StudentDiscoveryResponse>>> discoverStudents(
            Authentication authentication,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String skillName,
            @RequestParam(required = false) String skillType,
            @RequestParam(required = false) String proficiency,
            @RequestParam(required = false) String college) {

        String currentEmail = authentication != null ? authentication.getName() : null;
        List<StudentDiscoveryResponse> students = discoveryService.discoverStudents(
                currentEmail, search, category, skillName, skillType, proficiency, college);

        return ResponseEntity.ok(ApiResponse.success("Discovered students retrieved", students));
    }
}
