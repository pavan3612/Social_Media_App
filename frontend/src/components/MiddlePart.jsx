import React, { useState } from "react";
import { FaImage, FaVideo, FaRegComment, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { MdArticle } from "react-icons/md";
import api from "../config/api";
import CommentModal from "./CommentModal"; // Import the new modal

// Receives setUser to update saved posts list in parent
const MiddlePart = ({ user, setUser, posts, setPosts, setIsPostModalOpen }) => {
  
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  // --- Like Function ---
  const handleLikePost = async (postId) => {
    try {
      // 1. Call API
      const { data } = await api.put(`/api/posts/like/${postId}`);
      
      // 2. Update UI (Replace the specific post with response from backend)
      setPosts((prevPosts) => 
          prevPosts.map((p) => (p.id === postId ? data : p))
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // --- Save Function ---
  const handleSavePost = async (postId) => {
    try {
        // 1. Call API
        const { data } = await api.put(`/api/posts/save/${postId}`);
        
        // 2. Update User State (Because saved posts are stored in User, not Post)
        if (user) {
            const isAlreadySaved = user.savedPost?.some(p => p.id === postId);
            let updatedSavedPosts;

            if (isAlreadySaved) {
                updatedSavedPosts = user.savedPost.filter(p => p.id !== postId);
            } else {
                // We add the current post data to the saved list
                // We find the post object from 'posts' array to add it locally
                const postToSave = posts.find(p => p.id === postId);
                updatedSavedPosts = [...(user.savedPost || []), postToSave];
            }

            // Update user state in HomePage
            setUser({ ...user, savedPost: updatedSavedPosts });
        }
        
    } catch (error) {
        console.error("Error saving post:", error);
    }
  };

  return (
    <div className="w-[50%] border-r border-gray-700 overflow-y-auto h-screen no-scrollbar relative">
        
        {/* Stories Section */}
        <div className="flex gap-4 p-6 overflow-x-auto no-scrollbar border-b border-gray-800">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex flex-col items-center min-w-[70px]">
              <div className="w-16 h-16 rounded-full border-2 border-pink-500 p-1 cursor-pointer">
                <img 
                  className="w-full h-full rounded-full object-cover" 
                  src={`https://i.pravatar.cc/150?img=${item + 10}`} 
                  alt="story" 
                />
              </div>
              <span className="text-xs mt-1 text-gray-300">User {item}</span>
            </div>
          ))}
        </div>

        {/* Create Post Card */}
        <div className="px-4 mb-6 mt-4">
           <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
               <div className="flex gap-4 items-center mb-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-white overflow-hidden">
                        {user?.image ? <img src={user.image} className="w-full h-full object-cover"/> : user?.firstName?.[0]}
                    </div>
                    <input 
                        type="text" 
                        placeholder="Create new post..." 
                        readOnly 
                        onClick={() => setIsPostModalOpen(true)}
                        className="w-full bg-black/50 rounded-full py-3 px-5 focus:outline-none border border-gray-700 hover:bg-black/70 transition cursor-pointer text-gray-400"
                    />
               </div>
               
               <div className="flex justify-between px-10 border-t border-gray-800 pt-3">
                   <div onClick={() => setIsPostModalOpen(true)} className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 px-4 py-2 rounded-lg transition">
                       <FaImage className="text-blue-500 text-lg"/>
                       <span className="text-sm font-semibold text-gray-400">Media</span>
                   </div>
                   <div onClick={() => setIsPostModalOpen(true)} className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 px-4 py-2 rounded-lg transition">
                       <FaVideo className="text-blue-500 text-lg"/>
                       <span className="text-sm font-semibold text-gray-400">Video</span>
                   </div>
                   <div onClick={() => setIsPostModalOpen(true)} className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 px-4 py-2 rounded-lg transition">
                       <MdArticle className="text-blue-500 text-lg"/>
                       <span className="text-sm font-semibold text-gray-400">Article</span>
                   </div>
               </div>
           </div>
        </div>

        {/* Post Feed */}
        <div className="p-4 space-y-6">
          {Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post) => {
                // CALCULATE STATES DYNAMICALLY
                // Check if current user is in the 'liked' list
                const isLiked = post.liked?.some(u => u.id === user?.id);
                // Check if post is in user's 'savedPost' list
                const isSaved = user?.savedPost?.some(p => p.id === post.id);

                return (
                <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white cursor-pointer overflow-hidden">
                      {post.user?.image ? <img src={post.user.image} className="w-full h-full object-cover"/> : post.user?.firstName?.[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm cursor-pointer hover:underline text-white">
                        {post.user?.firstName} {post.user?.lastName}
                      </h3>
                      <p className="text-gray-400 text-xs">@{post.user?.firstName?.toLowerCase()}</p>
                    </div>
                  </div>

                  {/* Media */}
                  {post.image && (
                    <div className="w-full aspect-square bg-black rounded-md overflow-hidden mb-3 border border-gray-800">
                        {post.image.includes("/video/") || post.image.endsWith(".mp4") ? (
                            <video src={post.image} controls className="w-full h-full object-contain" />
                        ) : (
                            <img src={post.image} alt="Post" className="w-full h-full object-contain" />
                        )}
                    </div>
                  )}

                  {/* Actions Section */}
                  <div className="flex justify-between items-center mb-3 text-white">
                      <div className="flex gap-4 text-2xl items-center">
                          
                          {/* LIKE ICON */}
                          <div 
                             onClick={() => handleLikePost(post.id)} 
                             className="cursor-pointer hover:scale-110 transition duration-200"
                          >
                              {isLiked ? (
                                  <AiFillHeart className="text-red-600 text-3xl" />
                              ) : (
                                  <AiOutlineHeart className="text-white text-3xl hover:text-gray-400" />
                              )}
                          </div>

                          {/* COMMENT ICON */}
                          <div 
                             onClick={() => setActiveCommentPostId(post.id)} 
                             className="cursor-pointer hover:text-gray-400"
                          >
                              <FaRegComment className="text-2xl"/>
                          </div>

                          {/* SHARE ICON */}
                          <div className="cursor-pointer hover:text-gray-400">
                             <i className="text-2xl">✈️</i>
                          </div>
                      </div>

                      {/* SAVE ICON */}
                      <div onClick={() => handleSavePost(post.id)} className="cursor-pointer hover:scale-110 transition duration-200">
                          {isSaved ? (
                              <FaBookmark className="text-white text-2xl" /> 
                          ) : (
                              <FaRegBookmark className="text-white text-2xl hover:text-gray-400" />
                          )}
                      </div>
                  </div>
                  
                  {/* Likes Count (Use post.liked.length, NOT likedByUsers) */}
                  <p className="font-semibold text-sm mb-2 text-white">
                      {post.liked?.length || 0} likes
                  </p>

                  <p className="text-sm text-white">
                    <span className="font-bold mr-2">{post.user?.firstName}</span>
                    {post.caption}
                  </p>
                  
                  <p className="text-gray-500 text-[10px] mt-2 uppercase">
                      {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )})
          ) : (
             <div className="text-center text-gray-500 py-10">No posts available.</div>
          )}
        </div>

        {/* Render Comment Modal if active */}
        {activeCommentPostId && (
            <CommentModal 
                postId={activeCommentPostId} 
                onClose={() => setActiveCommentPostId(null)} 
            />
        )}
      </div>
  );
};

export default MiddlePart;