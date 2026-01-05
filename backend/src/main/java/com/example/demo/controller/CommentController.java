package com.example.demo.controller;

import com.example.demo.models.Comment;
import com.example.demo.models.User;
import com.example.demo.service.CommentService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@RestController
public class CommentController {

    @Autowired
    private UserService userService;

    @Autowired
    private CommentService commentService;

    @PostMapping("/api/comment/post/{postId}")
    public Comment createComment(@RequestBody Comment comment,@RequestHeader("Authorization") String jwt,@PathVariable Integer postId) throws Exception {
        User user = userService.getUser(jwt);
        Comment newcomment = commentService.createComment(comment,user,postId);
        return newcomment;
    }

    @GetMapping("/api/comment/post/{postId}")
    public List<Comment> findCommentById(@PathVariable Integer postId){
        List<Comment> comments = commentService.findCommentsByPostId(postId);
        return comments;
    }
}
