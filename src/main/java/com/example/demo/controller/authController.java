package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.configuration.jwtProvider;
import com.example.demo.models.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.request.LoginRequest;
import com.example.demo.response.AuthResponse;
import com.example.demo.service.CustomUserDetailsService;
import com.example.demo.service.UserService;

@RestController 
@RequestMapping("/Auth")
public class authController {
	
    @Autowired
	UserService userService; 
    
    @Autowired
    UserRepository userRepository; 
    
    @Autowired
    private PasswordEncoder passwordEncoder; 
    
	@Autowired
    private CustomUserDetailsService customUserDetails; 
    
	@PostMapping("/signUp")
	public AuthResponse createUser(@RequestBody User user) throws Exception {
		
		User IsExist = userRepository.findByMail(user.getMail()); 
		if(IsExist != null) {
			throw new Exception("Already Email Exists"); 
		}
	
			User newUser = new User(); 
			newUser.setMail(user.getMail());
			newUser.setFirstName(user.getFirstName());
			newUser.setLastName(user.getLastName());
			newUser.setPassword(passwordEncoder.encode(user.getPassword()));
			newUser.setId(user.getId());
			User savedUser=userRepository.save(newUser); 
			
			Authentication authentication = new UsernamePasswordAuthenticationToken(savedUser.getMail(),savedUser.getPassword());
			
			String token = jwtProvider.generateToken(authentication); 
			
			AuthResponse res = new AuthResponse(token,"Login success"); 
			return res; 
	}

	@PostMapping("/signIn")
	public AuthResponse signInUser(@RequestBody LoginRequest loginrequest) {
		
		Authentication authentication = authenticate(loginrequest.getEmail(),loginrequest.getPassword()); 
		
		String token = jwtProvider.generateToken(authentication); 
		
		AuthResponse res = new AuthResponse(token,"Register success"); 
		return res; 
	}

	private Authentication authenticate(String email, String password) {
		UserDetails userDetails = customUserDetails.loadUserByUsername(email); 
		
		if(userDetails == null) {
			throw new BadCredentialsException("Invalid username"); 
		}
		
		if(!passwordEncoder.matches(password, userDetails.getPassword())) {
			throw new BadCredentialsException("Password not match"); 
		}
		
		return new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities()); 
	}
}


