import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../config/api";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import axios from "axios"; 

const ProfilePage = () => {
  // 'user' will represent the Profile being VIEWED
  const [user, setUser] = useState(null);
  
  // 'loggedInUser' represents ME (the one logged in)
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [myPosts, setMyPosts] = useState([]);       
  const [savedPosts, setSavedPosts] = useState([]); 
  const [notes, setNotes] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL (e.g., /profile/5)

  // Computed Properties
  const isOwnProfile = loggedInUser && user && loggedInUser.id === user.id;
  const isFollowing = loggedInUser && user && user.followers.includes(loggedInUser.id);

  useEffect(() => {
    fetchProfileData();
  }, [id]); // Re-run if ID changes

  const fetchProfileData = async () => {
    try {
      // 1. Fetch Logged In User (Always needed for Sidebar & logic)
      const meRes = await api.get("/api/user/profile");
      const me = meRes.data;
      setLoggedInUser(me);

      // 2. Determine who is the "Profile User"
      let profileUser = me; 
      
      // If URL has an ID and it is NOT me, fetch that user
      if (id && parseInt(id) !== me.id) {
         try {
             const otherUserRes = await api.get(`/api/users/${id}`);
             profileUser = otherUserRes.data;
         } catch (err) {
             console.error("User not found", err);
         }
      }
      
      setUser(profileUser);

      // 3. Fetch Posts for the Profile User
      try {
          if (profileUser.id === me.id) {
              // If it's ME, use the specific endpoint
              const myPostsRes = await api.get("/api/posts/user");
              setMyPosts(myPostsRes.data);
          } else {
              // If it's someone else, fetch ALL posts and filter (Workaround if no specific endpoint exists)
              // Or use api.get(`/api/posts/user/${profileUser.id}`) if you added that endpoint
              const allPostsRes = await api.get("/api/posts");
              const userPosts = allPostsRes.data.filter(p => p.user.id === profileUser.id);
              setMyPosts(userPosts);
          }
      } catch (err) {
          console.error("Error fetching posts", err);
      }

      // 4. Fetch SAVED Posts & Notes (Only if it's MY profile)
      if (profileUser.id === me.id) {
          try {
              const savedRes = await api.get("/api/posts/saved"); 
              setSavedPosts(savedRes.data);
          } catch (err) { console.error(err); }

          try {
              const notesRes = await api.get("/api/Notes");
              setNotes(notesRes.data);
          } catch (err) { console.error(err); }
      } else {
          // Clear sensitive data if viewing others
          setSavedPosts([]);
          setNotes([]);
      }

    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleFollowUser = async () => {
      if (!user || !loggedInUser) return;
      try {
          // Logic: api.put(`/api/users/{followerId}/{followeeId}`)
          await api.put(`/api/users/${loggedInUser.id}/${user.id}`);
          alert(isFollowing ? "Unfollowed" : "Followed");
          fetchProfileData(); // Refresh data to update counts
      } catch (error) {
          console.error("Error following user:", error);
      }
  };

  // Group Notes logic...
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
      {/* Sidebar shows Logged In User */}
      <Sidebar user={loggedInUser} />

      <div className="w-full lg:w-[80%] p-10 overflow-y-auto h-screen custom-scrollbar">
        {user && (
          <div className="max-w-4xl mx-auto">
            {/* --- 1. HEADER SECTION --- */}
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
                  
                  {/* BUTTONS LOGIC */}
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
                        className={`${isFollowing ? "bg-gray-800 text-white" : "bg-blue-600 text-white"} px-6 py-1 rounded font-bold text-sm hover:opacity-90`}
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

            {/* --- 2. TABS SECTION --- */}
            <div className="flex justify-center border-t border-gray-800 mb-6">
              <button onClick={() => setActiveTab("posts")} className={`px-6 py-3 text-xs font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === "posts" ? "border-t border-white text-white" : "text-gray-500"}`}>
                Grid
              </button>
              {/* Only show Saved/Notes tabs if it is MY profile */}
              {isOwnProfile && (
                  <>
                    <button onClick={() => setActiveTab("saved")} className={`px-6 py-3 text-xs font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === "saved" ? "border-t border-white text-white" : "text-gray-500"}`}>
                        Saved
                    </button>
                    <button onClick={() => setActiveTab("notes")} className={`px-6 py-3 text-xs font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === "notes" ? "border-t border-white text-white" : "text-gray-500"}`}>
                        Notes 📝
                    </button>
                  </>
              )}
            </div>

            {/* --- 3. CONTENT SECTION --- */}
            
            {/* GRID TAB */}
            {activeTab === "posts" && (
              <div className="grid grid-cols-3 gap-1">
                {myPosts.length > 0 ? myPosts.map(post => (
                  <div key={post.id} className="aspect-square bg-gray-800 group relative cursor-pointer">
                    {post.image ? (
                        <img src={post.image} alt="" className="w-full h-full object-cover"/>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-600">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center gap-4">
                        <span>❤️ {post.liked?.length || 0}</span>
                    </div>
                  </div>
                )) : <div className="col-span-3 text-center py-10 text-gray-500">No posts yet.</div>}
              </div>
            )}

            {/* SAVED TAB (Only render if Own Profile) */}
            {activeTab === "saved" && isOwnProfile && (
              <div className="grid grid-cols-3 gap-1">
                 {savedPosts.length > 0 ? savedPosts.map(post => (
                  <div key={post.id} className="aspect-square bg-gray-800 group relative cursor-pointer">
                    {post.image ? (
                        <img src={post.image} alt="" className="w-full h-full object-cover"/>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-600">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center gap-4">
                        <span className="font-bold">Saved</span>
                    </div>
                  </div>
                )) : (
                    <div className="col-span-3 text-center py-20 text-gray-500">
                        <p>No saved posts.</p>
                    </div>
                )}
              </div>
            )}

            {/* NOTES TAB (Only render if Own Profile) */}
            {activeTab === "notes" && isOwnProfile && (
               <div className="space-y-8">
                  {Object.keys(groupedNotes).length > 0 ? (
                      Object.keys(groupedNotes).map((dateKey) => (
                        <div key={dateKey} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                            <h3 className="text-blue-400 font-bold text-lg mb-4 sticky top-0 bg-gray-900 py-2 border-b border-gray-800">{dateKey}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {groupedNotes[dateKey].map((note) => (
                                    <div key={note.id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer">
                                        <p className="text-gray-200 line-clamp-3 whitespace-pre-wrap">{note.content || note.noteContent}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                      ))
                  ) : <div className="text-center py-20 text-gray-500">No notes yet.</div>}
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