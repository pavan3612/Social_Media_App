package com.example.demo.controller;

import com.example.demo.models.Note;
import com.example.demo.models.User;
import com.example.demo.service.NoteService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class NoteController {

    @Autowired
    UserService userService;

    @Autowired
    NoteService noteService;

    @PostMapping("/api/Notes")
    public Note CreateNote(@RequestBody Note note, @RequestHeader("Authorization") String jwt){
        User user = userService.getUser(jwt);
        Note createNote = noteService.createNote(note,user);
        return createNote;
    }

    @GetMapping("/api/Notes")
    public List<Note> findByUserId(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.getUser(jwt);
        List<Note> notes = noteService.findNoteByUserId(user);
        return notes;
    }
}
