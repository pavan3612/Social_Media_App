package com.example.demo.service;

import com.example.demo.models.Comment;
import com.example.demo.models.Post;
import com.example.demo.models.User;
import com.example.demo.repository.ChatRepository;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ImplementingCommentService implements CommentService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostService postService;
    @Autowired
    private CommentRepository commentRepository;

    @Override
    public Comment createComment(Comment comment, User user, Integer postId) throws Exception {
        Comment newComment = new Comment();
        Post post = postService.findPostById(postId);
        newComment.setContent(comment.getContent());
        newComment.setPost(post);
        newComment.setUser(user);
        newComment.setLiked(null);
        newComment.setTimeStamp(LocalDateTime.now());
        return commentRepository.save(newComment);
    }

    @Override
    public List<Comment> findCommentsByPostId(Integer postId) {

        List<Comment> comments = commentRepository.findByPostId(postId);

        return comments;
    }
}
