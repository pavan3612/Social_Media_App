package com.example.demo.repository;

import com.example.demo.models.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface NoteRepository extends JpaRepository<Note,Integer> {

    @Query("select n from Note n where n.user.id = :userId")
    public List<Note> findByUserId(Integer userId);
}
