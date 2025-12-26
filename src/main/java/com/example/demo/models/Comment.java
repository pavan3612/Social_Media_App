package com.example.demo.models;
import java.util.*; 
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

@Entity
public class Comment {
     
	@Id
	public Integer id; 
	
	public String content; 
	
	public Comment(Integer id, String content, User user, List<User> liked) {
		super();
		this.id = id;
		this.content = content;
		this.user = user;
		this.liked = liked;
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

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public List<User> getLiked() {
		return liked;
	}

	public void setLiked(List<User> liked) {
		this.liked = liked;
	}

	@ManyToOne
	private User user;
	
	@ManyToMany
	private List<User> liked = new ArrayList<User>(); 
	
	public Comment() {
		
	}
}
