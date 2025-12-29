package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Chat;
import com.example.demo.models.Message;
import com.example.demo.models.User;
import com.example.demo.repository.ChatRepository;
import com.example.demo.repository.MessageRepository;

@Service
public class ImplementingMessageService implements MessageService{
	
	@Autowired
	private MessageRepository messageRepository; 
	
	@Autowired
	ChatRepository chatRepository; 
	
	@Autowired
	private ChatService chatService;
	
	@Override
	public Message createMessage(User user,Integer chatId,Message req) throws Exception{
		Message message =  new Message(); 
		Chat chat = chatService.findChatById(chatId); 
	    message.setChat(chat);
	    message.setContent(req.getContent());
	    message.setImage(req.getImage());
	    message.setUser(user);
	    message.setTimeStamp(LocalDateTime.now());
	    chat.getMessages().add(message); 
	    chatRepository.save(chat); 
		return messageRepository.save(message);
	}

	@Override
	public List<Message> findchatsMessages(Integer chatId) throws Exception {
		// TODO Auto-generated method stub
		Chat chat = chatService.findChatById(chatId); 
		return messageRepository.findByChatId(chatId);
	}

}
