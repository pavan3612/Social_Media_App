package com.example.demo.models;
import java.time.LocalDateTime;
import java.util.*;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

@Entity
public class Chat {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id; 
    
	private String chatName; 
	
	public List<Message> getMessages() {
		return messages;
	}

	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}

	private String chatImage; 
	
	@ManyToMany
	private List<User> users = new ArrayList<>();
	
	@OneToMany(mappedBy = "chat")
	private List<Message> messages = new ArrayList<>(); 
    
	private LocalDateTime timeStamp;
	
	public LocalDateTime getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(LocalDateTime timeStamp) {
		this.timeStamp = timeStamp;
	}

	public Chat() {
		
	}
	
	
	public Chat(Integer id, String chatName, String chatImage, List<User> users, List<Message> messages,
			LocalDateTime timeStamp) {
		super();
		this.id = id;
		this.chatName = chatName;
		this.chatImage = chatImage;
		this.users = users;
		this.messages = messages;
		this.timeStamp = timeStamp;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getChatName() {
		return chatName;
	}

	public void setChatName(String chatName) {
		this.chatName = chatName;
	}

	public String getChatImage() {
		return chatImage;
	}

	public void setChatImage(String chatImage) {
		this.chatImage = chatImage;
	}

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}
	
	
}
