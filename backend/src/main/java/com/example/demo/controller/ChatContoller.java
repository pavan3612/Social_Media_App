package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;
import com.example.demo.models.Chat;
import com.example.demo.models.User;
import com.example.demo.request.CreateChatRequest;
import com.example.demo.service.ChatService;
import com.example.demo.service.UserService;

@RestController 
public class ChatContoller {
  
   @Autowired
   private ChatService chatService; 
   
   @Autowired
   private UserService userService;
   
   @PostMapping("/api/chats")
   public Chat createChat(@RequestHeader("Authorization")String jwt,@RequestBody CreateChatRequest req) {
	  User reqUser = userService.getUser(jwt);
	  User user2 = userService.findUserById(req.getUserId());
	  Chat chat = chatService.createChat(reqUser, user2); 
	  return chat; 
   }
   
   @GetMapping("/api/chats")
   public List<Chat> findUsersChat(@RequestHeader("Authorization")String jwt) {
	  
	 User user = userService.getUser(jwt); 
	 
     List<Chat> chats = chatService.findUsersChat(user.getId()); 
	 return chats; 
   }
   
}
