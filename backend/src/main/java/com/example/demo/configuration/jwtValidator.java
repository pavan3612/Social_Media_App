package com.example.demo.configuration;

import java.io.IOException;
import java.util.*;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.*;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class jwtValidator extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String jwt = request.getHeader(jwtConstant.JWT_HEADER); 
        
        // 1. Check if token exists AND starts with "Bearer " (Standard convention)
        if(jwt != null && jwt.startsWith("Bearer ")) {
            
            try {
                String email = jwtProvider.getEmailFromJwt(jwt); 
                
                List<GrantedAuthority> authorities = new ArrayList<>(); 
                
                Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, authorities); 
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
            catch(Exception e) {
                // OPTIONAL: Print the real error to console so you know WHY it failed 
                // (e.g., Expired vs Malformed)
                System.out.println("JWT Validation failed: " + e.getMessage());
                throw new BadCredentialsException("invalid token"); 
            }
        }
        
        filterChain.doFilter(request, response);
    }
}