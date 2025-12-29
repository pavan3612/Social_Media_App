package com.example.demo.models;

import java.time.LocalDateTime;
import java.util.*; 
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Post {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
    public Integer id; 
	
	private String caption; 
	
	private String informationType; 
	
	private String image; 
	
    public Post(){
    	
    }
    public Post(Integer id, String caption, String informationType, String image, String video, User user,
			List<User> liked, LocalDateTime createdAt) {
		super();
		this.id = id;
		this.caption = caption;
		this.informationType = informationType;
		this.image = image;
		this.video = video;
		this.user = user;
		this.liked = liked;
		this.createdAt = createdAt;
	}
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getCaption() {
		return caption;
	}

	public List<User> getLiked() {
		return liked;
	}

	public void setLiked(List<User> liked) {
		this.liked = liked;
	}



	public void setCaption(String caption) {
		this.caption = caption;
	}

	public String getInformationType() {
		return informationType;
	}

	public void setInformationType(String informationType) {
		this.informationType = informationType;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getVideo() {
		return video;
	}

	public void setVideo(String video) {
		this.video = video;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	private String video; 
	
	@ManyToOne
	private User user; 
	
	@OneToMany
	private List<User> liked = new ArrayList<>(); 
	
	private LocalDateTime createdAt; 
	
	
}
