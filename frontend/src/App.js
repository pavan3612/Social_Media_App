import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Authentication from './pages/Authentication';
import HomePage from './pages/HomePage';
import MessagePage from './pages/MessagePage'; // Import the new page
import SearchPage from './pages/SearchPage'; 
import Notes from './pages/Notes';
import ProfilePage from './pages/ProfilePage';
function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/message" element={<MessagePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/notes" element={<Notes/>} />
        <Route path="/profile" element ={<ProfilePage/> } /> 
        <Route path="/profile/:id" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;