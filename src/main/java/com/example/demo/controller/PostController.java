package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;
import com.example.demo.models.Post;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.PostService;

@RestController
public class PostController {
    
	@Autowired
	PostService postService; 
	
	@PostMapping("/posts/user/{userId}")
	public ResponseEntity<Post> createdPost(@RequestBody Post post,@PathVariable Integer userId) throws Exception{
		
		Post createdPost = postService.createNewPost(post, userId); 
		
		return new ResponseEntity<Post>(createdPost,HttpStatus.ACCEPTED); 
	}
	
	@DeleteMapping("/posts/{postId}/user/{userId}")
	public ResponseEntity<ApiResponse> deletePost(Integer postId,Integer userId) throws Exception{
	   	
	   String message = postService.deletePost(postId, userId); 
	   ApiResponse res = new ApiResponse(message,true); 
	   return new ResponseEntity<ApiResponse>(res,HttpStatus.OK);
	}
	
	@GetMapping("/posts/{postId}")
	public ResponseEntity<Post> findPostByIdHandler(@PathVariable Integer postId) throws Exception{
		
		Post post = postService.findPostById(postId); 
		
		
		return new ResponseEntity<Post>(post,HttpStatus.ACCEPTED); 
	}
	
	@GetMapping("/posts/{userId}")
	public ResponseEntity<List<Post>> findUsersPost(@PathVariable Integer userId) throws Exception{
		
		List<Post> posts = postService.findPostByUserId(userId);
		
		return new ResponseEntity<List<Post>>(posts,HttpStatus.ACCEPTED); 
	}
	
	@GetMapping("/posts")
	public ResponseEntity<List<Post>> findAllPost(){
		List<Post> posts = postService.findAllPost(); 
		
		return new ResponseEntity<List<Post>>(posts,HttpStatus.ACCEPTED); 
	}
	
	@PutMapping("/posts/{postId}/user/{userId}")
	public ResponseEntity<Post> savedPostHandler(@PathVariable Integer userId,@PathVariable Integer postId) throws Exception{
		Post post = postService.savedPost(postId, userId);
		
		return new ResponseEntity<Post>(post,HttpStatus.ACCEPTED); 	
	}
	
	@PutMapping("/posts/like/{postId}/user/{userId}")
	public ResponseEntity<Post> likePostHandler(@PathVariable Integer userId,@PathVariable Integer postId) throws Exception{
		Post post = postService.likePost(postId, userId);
		
		return new ResponseEntity<Post>(post,HttpStatus.ACCEPTED); 	
	}
	
}
