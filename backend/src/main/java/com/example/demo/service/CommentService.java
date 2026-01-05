package com.example.demo.service;

import com.example.demo.models.Comment;
import com.example.demo.models.User;

import java.util.List;

public interface CommentService {

    public Comment createComment(Comment comment, User user,Integer postId) throws Exception;

    public List<Comment> findCommentsByPostId(Integer postId);

}
