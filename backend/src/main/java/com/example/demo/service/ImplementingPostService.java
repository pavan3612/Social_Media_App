package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Post;
import com.example.demo.models.User;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.UserRepository;

@Service
public class ImplementingPostService implements PostService {

	@Autowired
	PostRepository postRepository; 
	
	@Autowired
	UserService userService;
	
	@Autowired
	UserRepository userRepository;
	
	@Override
	public Post createNewPost(Post post,User user)throws Exception{
		Post newPost = new Post(); 
		newPost.setCaption(post.getCaption());
		newPost.setInformationType(post.getInformationType());;
		newPost.setImage(post.getImage());
		newPost.setVideo(post.getVideo());
		newPost.setCreatedAt(LocalDateTime.now());
		newPost.setUser(user);
		return postRepository.save(newPost);
	}

	@Override
    public String deletePost(Integer postId,User user) throws Exception{
		
	   Post post = findPostById(postId);
	   
	   if(post.getUser().getId() != user.getId()) {
		   throw new Exception("you can't delete another user's post"); 
	   }
	   
	   postRepository.delete(post);
    	   return "post deleted successfully"; 
    }
	
	@Override
	public List<Post> findPostByUserId(User user){
		Integer userId = user.getId();
		return postRepository.findPostByUserId(userId); 
	}
	
	@Override
	public Post findPostById(Integer postId) throws Exception {
		Optional<Post> opt = postRepository.findById(postId); 
		
		if(opt.isEmpty()) {
			throw new Exception("post not found with id"+postId); 
		}
		return opt.get(); 
	}
	
	@Override
	public List<Post> findAllPost(){
		return postRepository.findAll(); 
	}

	@Override
	public Post savedPost(Integer postId, User user) throws Exception {
		Post post = findPostById(postId);
		// FIX: Check by ID, not by Object reference
		boolean isSaved = false;
		for (Post p : user.getSavedPost()) {
			if (p.getId().equals(post.getId())) {
				isSaved = true;
				break;
			}
		}
		if (isSaved) {
			// Remove if already saved
			user.getSavedPost().removeIf(p -> p.getId().equals(post.getId()));
		} else {
			// Add if not saved
			user.getSavedPost().add(post);
		}
		userRepository.save(user);
		return post;
	}

	@Override
	public Post likePost(Integer postId, Integer userId) throws Exception {
		Post post = findPostById(postId);
		User user = userService.findUserById(userId);
		// FIX: Check if user is in the liked list by matching IDs
		boolean isLiked = false;
		for (User u : post.getLiked()) {
			if (u.getId() == user.getId()) {
				isLiked = true;
				break;
			}
		}
		if (isLiked) {
			// Un-like: Remove the user with the matching ID
			post.getLiked().removeIf(u -> u.getId() == user.getId());
		} else {
			// Like: Add the user
			post.getLiked().add(user);
		}

		return postRepository.save(post);
	}
	
}
