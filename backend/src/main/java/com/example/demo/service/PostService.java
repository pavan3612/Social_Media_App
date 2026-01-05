package com.example.demo.service;
import java.util.*;
import com.example.demo.models.Post;
import com.example.demo.models.User;

public interface PostService {
   
   public	Post createNewPost(Post post, User user) throws Exception;
	
   public 	String deletePost(Integer postId,User user) throws Exception ;
	
   public List<Post> findPostByUserId(User user);
	
   public 	Post findPostById(Integer postId) throws Exception;
	
   public 	List<Post> findAllPost();
	
  public Post savedPost(Integer PostId,User user) throws Exception;
	
  public 	Post likePost(Integer postId,Integer userId)throws Exception;
	
}
