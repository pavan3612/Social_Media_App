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


// ... (EditProfileModal remains exactly the same as previous steps) ...
const EditProfileModal = ({ user, onClose, onUpdate }) => {
    const [firstName, setFirstName] = useState(user.firstName || "");
    const [lastName, setLastName] = useState(user.lastName || "");
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(user.image || null);
    const [isLoading, setIsLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "LearnInsta"); 
        formData.append("cloud_name", "dhkcvghi7"); 
    
        try {
          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/dhkcvghi7/image/upload`,
            formData
          );
          return res.data.secure_url;
        } catch (error) {
          console.error("Cloudinary Upload Error:", error);
          throw error;
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            let imageUrl = user.image; 

            if (imageFile) {
                imageUrl = await uploadToCloudinary(imageFile);
            }

            const updateData = {
                firstName: firstName,
                lastName: lastName,
                image: imageUrl
            };

            await api.put("/api/user/edit", updateData);
            
            alert("Profile Updated Successfully!");
            onUpdate(); 
            onClose();  

        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-xl w-[90%] max-w-md border border-gray-800">
                <h2 className="text-xl font-bold mb-4 text-white">Edit Profile</h2>
                
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 rounded-full bg-gray-700 overflow-hidden border-2 border-blue-500">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl font-bold">{firstName[0]}</div>
                            )}
                        </div>
                        <label className="text-blue-400 text-sm cursor-pointer hover:underline">
                            Change Profile Photo
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm">First Name</label>
                        <input 
                            type="text" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full bg-gray-800 text-white p-2 rounded mt-1 focus:outline-none focus:border-blue-500 border border-gray-700"
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm">Last Name</label>
                        <input 
                            type="text" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full bg-gray-800 text-white p-2 rounded mt-1 focus:outline-none focus:border-blue-500 border border-gray-700"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={isLoading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold disabled:opacity-50"
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
