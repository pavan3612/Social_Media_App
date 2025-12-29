package com.example.demo.models;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Note {
	
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Integer id; 
	
  private String Content; 
  
  @ManyToOne
  private User user;
   
  private LocalDateTime timeStamp;
  
  public Note() {}
  
  public Note(Integer id, String content, User user, LocalDateTime timeStamp) {
	super();
	this.id = id;
	Content = content;
	this.user = user;
	this.timeStamp = timeStamp;
}



  public Integer getId() {
	return id;
  }

  public void setId(Integer id) {
	this.id = id;
  }

  public String getContent() {
	return Content;
  }

  public void setContent(String content) {
	Content = content;
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
