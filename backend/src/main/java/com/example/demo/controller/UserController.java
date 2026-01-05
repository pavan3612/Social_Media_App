package com.example.demo.controller;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.models.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;

@RestController
public class UserController {
    
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	UserService userService; 
	
	@GetMapping("/api/users")
	public List<User>  usercontroller(){
		List<User>  users = userRepository.findAll(); 	
		return users;
	}
	
	@GetMapping("/api/users/{userId}")
	public User getUserById(@PathVariable("userId") Integer id){
		
		User user =(userService.findUserById(id));
		return user;
	}

	@PutMapping("/api/user/edit")
	public User updateUserbyId(@RequestHeader("Authorization")String jwt,@RequestBody User user) throws Exception {
		User reqUser = userService.getUser(jwt); 
		int userId = reqUser.getId();
		User user1 = userService.updateUser(user, userId); 
		return user1; 
	}
	
	@PutMapping("/api/users/{userId1}/{userId2}")
	public User followUserHandler(@PathVariable Integer userId1,@PathVariable Integer userId2) {
		 User user = userService.followUser(userId1, userId2); 
		 return user; 
	}
	
	@GetMapping("/api/users/search")
	public List<User> searchUser(@RequestParam("query") String query){
		 List<User> users= userService.searchUser(query); 
		 return users;
	}
	
	@GetMapping("/api/user/profile")
	public User GetUserFromToken(@RequestHeader("Authorization")String jwt) {
		User user = userService.getUser(jwt); 
		return user; 
	}
}
