import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import api from "../config/api";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; 

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [myPosts, setMyPosts] = useState([]);       
  const [savedPosts, setSavedPosts] = useState([]); 
  const [notes, setNotes] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();

  const isOwnProfile = loggedInUser && user && loggedInUser.id === user.id;
  const isFollowing = loggedInUser && user && user.followers?.includes(loggedInUser.id);

  // ✅ FIXED: useCallback
  const fetchProfileData = useCallback(async () => {
    try {
      const meRes = await api.get("/api/user/profile");
      const me = meRes.data;
      setLoggedInUser(me);

      let profileUser = me;

      if (id && parseInt(id) !== me.id) {
        try {
          const otherUserRes = await api.get(`/api/users/${id}`);
          profileUser = otherUserRes.data;
        } catch (err) {
          console.error("User not found", err);
        }
      }

      setUser(profileUser);

      if (profileUser.id === me.id) {
        const myPostsRes = await api.get("/api/posts/user");
        setMyPosts(myPostsRes.data);
      } else {
        const allPostsRes = await api.get("/api/posts");
        const userPosts = allPostsRes.data.filter(
          (p) => p.user.id === profileUser.id
        );
        setMyPosts(userPosts);
      }

      if (profileUser.id === me.id) {
        const savedRes = await api.get("/api/posts/saved");
        setSavedPosts(savedRes.data);

        const notesRes = await api.get("/api/Notes");
        setNotes(notesRes.data);
      } else {
        setSavedPosts([]);
        setNotes([]);
      }

    } catch (error) {
      console.error("Error loading profile:", error);
    }
  }, [id]);

  // ✅ FIXED: dependency
  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleFollowUser = async () => {
    if (!user || !loggedInUser) return;
    try {
      await api.put(`/api/users/${loggedInUser.id}/${user.id}`);
      alert(isFollowing ? "Unfollowed" : "Followed");
      fetchProfileData();
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const getGroupedNotes = () => {
    const groups = {};
    notes.forEach((note) => {
      const dateRaw = note.createdAt || new Date().toISOString(); 
      const dateKey = new Date(dateRaw).toLocaleDateString("en-US", {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(note);
    });
    return groups;
  };

  const groupedNotes = getGroupedNotes();

  return (
    <div className="bg-black min-h-screen text-white flex">
      <Sidebar user={loggedInUser} />

      <div className="w-full lg:w-[80%] p-10 overflow-y-auto h-screen custom-scrollbar">
        {user && (
          <div className="max-w-4xl mx-auto">

            {/* HEADER */}
            <div className="flex gap-10 items-center border-b border-gray-800 pb-10 mb-6">
              <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center text-4xl font-bold overflow-hidden border-4 border-black">
                {user.image ? (
                    <img src={user.image} alt="profile" className="w-full h-full object-cover" />
                ) : (
                    <span>{user.firstName?.[0]}</span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-6 mb-4">
                  <h2 className="text-2xl font-light">{user.firstName} {user.lastName}</h2>
                  
                  {isOwnProfile ? (
                      <>
                        <button onClick={() => navigate("/notes")} className="bg-gray-800 px-4 py-1 rounded font-bold text-sm hover:bg-gray-700">
                            + Create Note
                        </button>
                        <button 
                            onClick={() => setIsEditModalOpen(true)} 
                            className="bg-gray-800 px-4 py-1 rounded font-bold text-sm hover:bg-gray-700"
                        >
                            Edit Profile
                        </button>
                      </>
                  ) : (
                      <button 
                        onClick={handleFollowUser}
                        className={`${isFollowing ? "bg-gray-800 text-white" : "bg-blue-600 text-white"} px-6 py-1 rounded font-bold text-sm`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                  )}
                </div>

                <div className="flex gap-8 text-base mb-4">
                  <span><span className="font-bold">{myPosts.length}</span> posts</span>
                  <span><span className="font-bold">{user.followers?.length || 0}</span> followers</span>
                  <span><span className="font-bold">{user.following?.length || 0}</span> following</span>
                </div>

                <p className="font-bold text-sm">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-400">Software Developer | Java & React</p>
              </div>
            </div>

            {/* POSTS GRID */}
            {activeTab === "posts" && (
              <div className="grid grid-cols-3 gap-1">
                {myPosts.length > 0 ? myPosts.map(post => (
                  <div key={post.id} className="aspect-square bg-gray-800 group relative">
                    {post.image ? (
                        <img src={post.image} alt="post" className="w-full h-full object-cover"/>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-600">No Image</div>
                    )}
                  </div>
                )) : <div className="col-span-3 text-center py-10 text-gray-500">No posts yet.</div>}
              </div>
            )}

          </div>
        )}
      </div>

      {isEditModalOpen && isOwnProfile && (
        <EditProfileModal 
            user={user} 
            onClose={() => setIsEditModalOpen(false)} 
            onUpdate={fetchProfileData} 
        />
      )}
    </div>
  );
};

export default ProfilePage;
