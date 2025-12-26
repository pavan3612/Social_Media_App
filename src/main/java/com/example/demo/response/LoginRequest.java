package com.example.demo.response;

public class LoginRequest {
   private String Email; 
   private String Password;
   public LoginRequest(String email, String password) {
	super();
	Email = email;
	Password = password;
   }
   public String getEmail() {
	return Email;
   }
   public void setEmail(String email) {
	Email = email;
   }
   public String getPassword() {
	return Password;
   }
   public void setPassword(String password) {
	Password = password;
   } 
   
   
}
