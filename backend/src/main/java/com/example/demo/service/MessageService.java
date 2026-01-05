package com.example.demo.service;
import java.util.*; 
import com.example.demo.models.Message;
import com.example.demo.models.User;

public interface MessageService {
	
    public Message createMessage(User user,Integer chatId,Message req) throws Exception;
    
    public List<Message> findchatsMessages(Integer chatId) throws Exception; 
    
}
