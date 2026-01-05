package com.example.demo.repository;

import com.example.demo.models.User;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // You can define custom queries here if needed later
	//public User findByEmail(mail); 
	public User findByMail(String email); 
	
	@Query("select u from User u where u.firstName LIKE %:query% OR u.lastName Like %:query% OR u.mail LIkE %:query")
	public List<User> searchUser(@Param("query") String query);
}
