package com.example.demo.controller;

import com.example.demo.models.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import com.example.demo.models.Post;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.PostService;

@RestController
@RequestMapping("/api")
public class PostController {
    
	@Autowired
	PostService postService;

	@Autowired
	UserService userService;
	
	@PostMapping("/posts")
	public ResponseEntity<Post> createdPost(@RequestHeader("Authorization")String jwt,@RequestBody Post post) throws Exception{

		User user = userService.getUser(jwt);
		Post createdPost = postService.createNewPost(post,user);
		
		return new ResponseEntity<Post>(createdPost,HttpStatus.ACCEPTED); 
	}
	
	@DeleteMapping("/posts/{postId}/user/{userId}")
	public ResponseEntity<ApiResponse> deletePost(Integer postId,@RequestHeader("Authorization") String jwt) throws Exception{
	   	User user = userService.getUser(jwt);
	   String message = postService.deletePost(postId, user);
	   ApiResponse res = new ApiResponse(message,true); 
	   return new ResponseEntity<ApiResponse>(res,HttpStatus.OK);
	}
	
	@GetMapping("/posts/{postId}")
	public ResponseEntity<Post> findPostByIdHandler(@PathVariable Integer postId) throws Exception{
		
		Post post = postService.findPostById(postId); 
		
		
		return new ResponseEntity<Post>(post,HttpStatus.ACCEPTED); 
	}
	
	@GetMapping("/posts/user")
	public ResponseEntity<List<Post>> findUsersPost(@RequestHeader("Authorization") String jwt) throws Exception{

		User user = userService.getUser(jwt);
		List<Post> posts = postService.findPostByUserId(user);
		
		return new ResponseEntity<List<Post>>(posts,HttpStatus.ACCEPTED); 
	}

	@GetMapping("/posts/saved")
	public ResponseEntity<List<Post>> findSavedPosts(@RequestHeader("Authorization") String jwt){

		User user = userService.getUser(jwt);

		List<Post> posts = user.getSavedPost();

 		return new ResponseEntity<List<Post>>(posts,HttpStatus.ACCEPTED);
	}

	@GetMapping("/posts")
	public ResponseEntity<List<Post>> findAllPost(){
		List<Post> posts = postService.findAllPost(); 
		
		return new ResponseEntity<List<Post>>(posts,HttpStatus.ACCEPTED); 
	}

	@PutMapping("/posts/like/{postId}")
	public ResponseEntity<Post> likePostHandler(
			@PathVariable Integer postId,
			@RequestHeader("Authorization") String jwt) throws Exception {

		User reqUser = userService.getUser(jwt);
		Post post = postService.likePost(postId, reqUser.getId());
		return new ResponseEntity<>(post, HttpStatus.OK);
	}

	@PutMapping("/posts/save/{postId}")
	public ResponseEntity<Post> savedPostHandler(
			@PathVariable Integer postId,
			@RequestHeader("Authorization") String jwt) throws Exception {

		User reqUser = userService.getUser(jwt);
		Post post = postService.savedPost(postId, reqUser);
		return new ResponseEntity<>(post, HttpStatus.OK);
	}
	
}
