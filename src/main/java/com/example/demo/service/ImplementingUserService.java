package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.configuration.jwtProvider;

//import com.example.demo.controller.Execption;

import com.example.demo.models.User;
import com.example.demo.repository.UserRepository;

@Service
public class ImplementingUserService implements UserService{

	@Autowired
	UserRepository userRepository;
	
	@Override
	public User registerUser(User user) {
		// TODO Auto-generated method stub
		User newUser = new User(); 
		newUser.setMail(user.getMail());
		newUser.setFirstName(user.getFirstName());
		newUser.setLastName(user.getLastName());
		newUser.setPassword(user.getPassword());
		newUser.setId(user.getId());
		User saveduser=userRepository.save(newUser); 

		return saveduser;
	}

	@Override
	public User findUserById(Integer userId) {
		// TODO Auto-generated method stub
		User temp = userRepository.findById(userId).orElse(null);
		return temp;
	}

	@Override
	public User findUserByEmail(String email) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public User  followUser(Integer userId1, Integer userId2) {
		User user1 = findUserById(userId1); 
		User user2 = findUserById(userId2); 
		
	    user2.getFollowers().add(user1.getId()); 
	    user1.getFollowings().add(user2.getId());
	     
	    userRepository.save(user1);  
	    userRepository.save(user2); 
		return user1;
	}

	@Override
	public User updateUser(User user,Integer userId) throws Exception {
         User user1 = findUserById(userId); 
		
		if(user1 == null) {
			throw new Exception("user not exist with id"+ userId); 
		}
		if(user.getFirstName() != null) {
		   user1.setFirstName(user.getFirstName());
		}
		if(user.getGender() != null) {
		  user1.setGender(user.getGender());
		}
		if(user.getLastName() != null) {
		  user1.setLastName(user.getLastName());
		}
        User saveduser=registerUser(user1); 
		
		return saveduser;
	}

	@Override
	public List<User> searchUser(String query) {
		
		return userRepository.searchUser(query);
	}
    
	@Override
	public User getUser(String jwt) {
		String email = jwtProvider.getEmailFromJwt(jwt); 
		User user = userRepository.findByMail(email); 
		return user; 
	}
}
