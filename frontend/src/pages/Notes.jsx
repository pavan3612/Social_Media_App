import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import api from "../config/api";
import { useNavigate } from "react-router-dom";

const Notes = () => {
  const [user, setUser] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const navigate = useNavigate();

  // Get Today's Date formatted nicely
  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/api/user/profile");
        setUser(data);
      } catch (error) {
        console.error("Error", error);
      }
    };
    fetchUser();
  }, []);

  const handleSaveNote = async () => {
    if (!noteContent.trim()) return;

    try {
      // Calls NoteController.java @PostMapping("/api/Notes")
      await api.post("/api/Notes", {
        content: noteContent, // Ensure your Java Note model has 'content' field
        // createdAt: new Date() // Optional: if backend doesn't set it automatically
      });
      
      alert("Note Saved Successfully!");
      setNoteContent(""); // Clear the input
      navigate("/profile"); // Go back to profile to see the list
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note.");
    }
  };

  return (
    <div className="bg-black min-h-screen text-white flex">
      <Sidebar user={user} />

      <div className="flex-1 p-10 flex flex-col h-screen relative">
        {/* Top Date Header */}
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-4xl font-bold text-gray-200">New Note</h1>
                <p className="text-blue-500 text-lg mt-2 font-semibold">{todayDate}</p>
            </div>
            <button 
                onClick={handleSaveNote}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition"
            >
                Save Note
            </button>
        </div>
        
        {/* Note Input Area */}
        <div className="flex-1 bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
          <textarea
            className="w-full h-full bg-transparent text-white text-lg focus:outline-none resize-none custom-scrollbar leading-relaxed"
            placeholder="Start typing your thoughts for today..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            spellCheck="false"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default Notes;