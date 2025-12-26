package com.example.demo.service;

import com.example.demo.models.User;

import java.util.*; 

public interface UserService {
	
     public User registerUser(User user); 
     
     public User findUserById(Integer userId); 
     
     public User findUserByEmail(String email); 
     
     public User followUser(Integer userId1,Integer userId2); 
     
     public User updateUser(User user,Integer userId) throws Exception; 
     
     public List<User> searchUser(String query);

	 public  User getUser(String jwt); 
}
 