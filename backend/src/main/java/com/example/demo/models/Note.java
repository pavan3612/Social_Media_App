package com.example.demo.models;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
public class Note {
	
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Integer id; 
	
  private String Content; 
  
  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;
   
  private LocalDateTime timeStamp;

  private LocalDateTime createdAt;

  public Note() {}

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Note(Integer id, String content, User user, LocalDateTime timeStamp) {
	super();
	this.id = id;
	Content = content;
	this.user = user;
	this.timeStamp = timeStamp;
}

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
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
