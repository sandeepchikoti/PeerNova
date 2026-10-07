package com.peernova.controller;

import com.peernova.dto.ApiResponse;
import com.peernova.dto.ConnectionResponseDTO;
import com.peernova.dto.SendConnectionRequest;
import com.peernova.dto.UpdateConnectionStatusRequest;
import com.peernova.service.ConnectionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    @Autowired
    private ConnectionService connectionService;

    @PostMapping("/request")
    public ResponseEntity<ApiResponse<ConnectionResponseDTO>> sendRequest(
            Authentication authentication,
            @Valid @RequestBody SendConnectionRequest request) {
        ConnectionResponseDTO response = connectionService.sendConnectionRequest(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Connection request sent successfully", response));
    }

    @PutMapping("/{connectionId}/respond")
    public ResponseEntity<ApiResponse<ConnectionResponseDTO>> respondToRequest(
            Authentication authentication,
            @PathVariable Long connectionId,
            @Valid @RequestBody UpdateConnectionStatusRequest request) {
        ConnectionResponseDTO response = connectionService.respondToConnectionRequest(
                authentication.getName(), connectionId, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Connection status updated to " + request.getStatus(), response));
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<ConnectionResponseDTO>>> getPendingRequestsReceived(Authentication authentication) {
        List<ConnectionResponseDTO> pending = connectionService.getPendingRequestsReceived(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Pending connection requests retrieved", pending));
    }

    @GetMapping("/sent")
    public ResponseEntity<ApiResponse<List<ConnectionResponseDTO>>> getPendingRequestsSent(Authentication authentication) {
        List<ConnectionResponseDTO> sent = connectionService.getPendingRequestsSent(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Sent connection requests retrieved", sent));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<ConnectionResponseDTO>>> getActiveConnections(Authentication authentication) {
        List<ConnectionResponseDTO> active = connectionService.getActiveConnections(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Active connections retrieved", active));
    }
}
