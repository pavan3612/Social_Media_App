package com.example.demo.service;


import com.example.demo.models.Note;
import com.example.demo.models.User;

import java.util.*;

public interface NoteService {

    public Note createNote(Note note , User user);

    public List<Note> findNoteByUserId(User user) throws Exception;
}
