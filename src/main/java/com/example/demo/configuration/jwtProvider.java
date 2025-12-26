package com.example.demo.configuration;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.security.core.Authentication;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class jwtProvider {
   private static  SecretKey key = Keys.hmacShaKeyFor(jwtConstant.SECRET_KEY.getBytes()); 
   public static String generateToken(Authentication auth) {
	   String jwt = Jwts.builder()
			       .setIssuer("pavan teja")
			       .setIssuedAt(new Date())
			       .setExpiration(new Date(new Date().getTime()+8640000))
			       .claim("email", auth.getName())
			       .signWith(key)
			       .compact();
	   return jwt; 
   }
   
   public  static  String getEmailFromJwt(String jwt) {
	  
	   jwt = jwt.substring(7); 
	   Claims claims= Jwts.parser().setSigningKey(key).build().parseClaimsJws(jwt).getBody();
	   String email = String.valueOf(claims.get("email")); 
	   
	   return email; 
   }
}
