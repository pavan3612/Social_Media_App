package com.example.demo.models;

import jakarta.persistence.*;

import java.util.*; 

@Entity
@Table(name ="spareuser")
public class User {

    @Id
    private int id;

    private String firstName;
    private String lastName;
    private String mail;
    private String password;
    private List<Integer> followers = new ArrayList<>(); 
    private List<Integer> followings = new ArrayList<>(); 
    
    public List<Integer> getFollowers() {
		return followers;
	}
	public void setFollowers(List<Integer> followers) {
		this.followers = followers;
	}
	public List<Integer> getFollowings() {
		return followings;
	}
	public void setFollowings(List<Integer> followings) {
		this.followings = followings;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}

	private String gender; 

   
    // Getters and Setters
    public int getId() {
        return id;
    } 
    public void setId(int id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getMail() {
        return mail;
    }
    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    
    public void FullName() {
    	  String k = "pavanteja "; 
    }
}
