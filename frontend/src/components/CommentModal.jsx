import React, { useState, useEffect } from "react";
import api from "../config/api";
import { AiOutlineClose } from "react-icons/ai";

const CommentModal = ({ postId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  // Fetch comments when modal opens
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await api.get(`/api/comment/post/${postId}`);
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    if(postId) fetchComments();
  }, [postId]);

  const handleCreateComment = async () => {
    if (!content.trim()) return;
    
    setIsLoading(true); // Disable button
    try {
      const { data } = await api.post(`/api/comment/post/${postId}`, {
        content: content,
      });
      
      // Add new comment to the top of the list
      setComments([data, ...comments]);
      setContent("");
      
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("Failed to create comment. Check console.");
    } finally {
      setIsLoading(false); // Re-enable button
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-[90%] max-w-md h-[500px] rounded-xl overflow-hidden border border-gray-800 flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-white font-bold text-lg">Comments</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
             <AiOutlineClose className="text-xl" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                         <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 overflow-hidden">
                            {comment.user?.image ? (
                                <img src={comment.user.image} className="w-full h-full object-cover"/>
                            ) : (
                                comment.user?.firstName?.[0]
                            )}
                         </div>
                         <div className="flex-1">
                             <p className="text-sm">
                                 <span className="font-bold mr-2 text-white">{comment.user?.firstName}</span>
                                 <span className="text-gray-300">{comment.content}</span>
                             </p>
                         </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 mt-10">No comments yet. Be the first!</p>
            )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-800 flex gap-2">
            <input 
                type="text" 
                className="w-full bg-black text-white rounded-full px-4 py-2 border border-gray-700 focus:outline-none focus:border-blue-500"
                placeholder="Add a comment..."
                value={content}
                disabled={isLoading}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateComment()}
            />
            <button 
                onClick={handleCreateComment}
                disabled={isLoading}
                className={`text-blue-500 font-bold text-sm px-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-400'}`}
            >
                {isLoading ? "Posting..." : "Post"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;