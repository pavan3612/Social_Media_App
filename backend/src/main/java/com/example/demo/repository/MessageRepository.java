package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*; 
import com.example.demo.models.Message;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message,Integer>{
   
	public List<Message> findByChatId(Integer chatId); 
	 
}
