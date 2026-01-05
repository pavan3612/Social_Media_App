package com.example.demo.models;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Message {
    
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	
	private String content; 
	
	private String image; 
	
	@ManyToOne
	private User user; 
	
	@JsonIgnore
	@ManyToOne
	private Chat chat;
	
	private LocalDateTime timeStamp;
	
	//Message_chat
	public Message() {
		
	}
	
	
	public Message(Integer id, String content, String image, User user, Chat chat, LocalDateTime timeStamp) {
		super();
		this.id = id;
		this.content = content;
		this.image = image;
		this.user = user;
		this.chat = chat;
		this.timeStamp = timeStamp;
	}


	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public Chat getChat() {
		return chat;
	}

	public void setChat(Chat chat) {
		this.chat = chat;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public LocalDateTime getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(LocalDateTime timeStamp) {
		this.timeStamp = timeStamp;
	}
}
