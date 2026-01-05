package com.example.demo.service;

import com.example.demo.models.Note;
import com.example.demo.models.User;
import com.example.demo.repository.NoteRepository;
import jdk.jshell.spi.ExecutionControl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImplementingNoteService implements NoteService{

    @Autowired
    UserService userService;

    @Autowired
    NoteRepository noteRepository;

    @Override
    public Note createNote(Note note, User user) {
        Note newNote = new Note();
        newNote.setContent(note.getContent());
        newNote.setUser(user);
        newNote.setTimeStamp(note.getTimeStamp());
        return noteRepository.save(newNote) ;
    }

    @Override
    public List<Note> findNoteByUserId(User user) throws Exception {
        Integer userId = user.getId();
        List<Note> notes = noteRepository.findByUserId(userId);
        if(notes.isEmpty()){
            throw new Exception("No notes available for the requested user");
        }
        return notes;
    }
}
