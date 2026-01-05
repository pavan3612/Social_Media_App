import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import Sidebar from "../components/Sidebar";
import MiddlePart from "../components/MiddlePart"; 
import CreatePostModal from "../components/CreatePostModel"; 

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isPostModalOpen, setIsPostModalOpen] = useState(false); 
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
          navigate("/");
          return;
        }

        // 1. Fetch User Profile
        const profileRes = await api.get("/api/user/profile");
        const currentUser = profileRes.data;
        console.log("User Fetched:", currentUser);
        
        // 2. Fetch Saved Posts (FIX: We need this because savedPost is hidden in profile)
        // Ensure you have this endpoint in PostController: @GetMapping("/api/posts/saved")
        // If your endpoint is different (e.g., /savedPosts/user), change it here.
        try {
          // Assuming you added the endpoint I suggested previously
          const savedPostsRes = await api.get("/api/posts/saved"); 
          // Attach saved posts to the user object manually
          currentUser.savedPost = savedPostsRes.data;
         } catch (err) {
          console.warn("Could not fetch saved posts", err);
          currentUser.savedPost = []; // Default to empty if fail
        }

        // DEBUG: Check console
        setUser(currentUser);

        // 2. Fetch Posts
        const postsRes = await api.get("/api/posts");
        console.log("Posts Fetched:", postsRes.data); // DEBUG: Check console
        
        // Safety check before setting posts
        if (Array.isArray(postsRes.data)) {
            setPosts(postsRes.data);
        } else {
            console.warn("Posts API returned non-array:", postsRes.data);
            setPosts([]);
        }

        // 3. Fetch Suggestions
        const usersRes = await api.get("/api/users");
        if (currentUser && Array.isArray(usersRes.data)) {
           const otherUsers = usersRes.data.filter(u => u.id !== currentUser.id);
           setSuggestedUsers(otherUsers);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleFollow = async (targetUserId) => {
    try {
      await api.put(`/api/users/${user.id}/${targetUserId}`);
      setSuggestedUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === targetUserId ? { ...u, followed: true } : u
        )
      );
    } catch (error) {
      console.error("Error following user:", error);
      alert("Failed to follow user.");
    }
  };

  if (isLoading) {
    return <div className="bg-black min-h-screen text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-black min-h-screen text-white flex">
      {/* 1. Sidebar */}
      <Sidebar user={user} />

      {/* 2. Middle Feed */}
      <MiddlePart 
        user={user} 
        setUser={setUser}  // <--- ADD THIS
        posts={posts} 
        setPosts={setPosts} 
        setIsPostModalOpen={setIsPostModalOpen} 
      />
      {/* 3. Right Sidebar (Suggestions) */}
      <div className="w-[30%] px-8 py-8 hidden lg:block">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 sticky top-10">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-400 text-sm">Suggestions for you</h3>
              <span className="text-xs text-white cursor-pointer hover:text-blue-400">See All</span>
           </div>
           
           <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
               {suggestedUsers.length > 0 ? (
                 suggestedUsers.map((u) => (
                   <div key={u.id} className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                           
                           {/* --- UPDATED AVATAR LOGIC --- */}
                           <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-white overflow-hidden">
                                {u.image ? (
                                    <img src={u.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{u.firstName?.[0]}</span>
                                )}
                           </div>
                           {/* ---------------------------- */}
                           
                           <div><p className="text-sm font-semibold text-white">{u.firstName}</p></div>
                       </div>
                       
                       <button
                            onClick={() => !u.followed && handleFollow(u.id)}
                            className={`text-xs font-bold transition ${
                                u.followed 
                                ? "text-gray-500 cursor-default" 
                                : "text-blue-500 hover:text-white cursor-pointer"
                            }`}
                        >
                            {u.followed ? "Following" : "Follow"}
                        </button>
                   </div>
                 ))
               ) : <p className="text-gray-500 text-xs">No suggestions</p>}
           </div>
        </div>
      </div>

      {isPostModalOpen && (
        <CreatePostModal onClose={() => setIsPostModalOpen(false)} />
      )}
    </div>
  );
};

export default HomePage;