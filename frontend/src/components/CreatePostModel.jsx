import React, { useState } from "react";
import api from "../config/api";
import axios from "axios"; // Ensure axios is installed
import { AiOutlineClose } from "react-icons/ai";
import { FaImage } from "react-icons/fa";

const CreatePostModal = ({ onClose }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // --- NEW: Upload to Cloudinary Function ---
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "LearnInsta"); // REPLACE with your preset name
    formData.append("cloud_name", "dhkcvghi7"); // REPLACE with your cloud name

    // Determine if it's image or video for the endpoint
    const resourceType = file.type.startsWith("video/") ? "video" : "image";
    
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dhkcvghi7/image/upload`,
        formData
      );
      console.log("error from cloudinary"+res.data.secure_url);
      return res.data.secure_url; // This is the URL we need
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!caption && !image) return;
    setIsLoading(true);

    try {
      let imageUrl = "";

      // 1. Upload to Cloudinary (Frontend -> Cloudinary)
      if (image) {
         imageUrl = await uploadToCloudinary(image);
         console.log("Uploaded URL:", imageUrl);
      }

      // 2. Send URL + Caption to Backend (Frontend -> Spring Boot)
      // Now we can send JSON because 'image' is just a string URL!
      const postData = {
          caption: caption,
          image: imageUrl 
      };

      await api.post("/api/posts", postData); // Standard JSON request

      alert("Post created!");
      onClose();
      window.location.reload(); 

    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ... (Your UI JSX remains exactly the same as before) ...
    // Just ensure the file input accepts video if you want: accept="image/*,video/*"
     <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-[90%] max-w-md rounded-xl overflow-hidden border border-gray-800">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-white font-bold text-lg">Create new post</h2>
          <button onClick={onClose} className="text-blue-500 font-bold text-sm">Cancel</button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-4">
            {/* Image Preview Area */}
            {preview ? (
                <div className="w-full h-64 bg-black rounded-lg overflow-hidden relative">
                    {/* CHECK IF IT IS VIDEO OR IMAGE */}
                    {image && image.type.startsWith("video/") ? (
                        <video 
                            src={preview} 
                            controls 
                            className="w-full h-full object-contain" 
                        />
                    ) : (
                        <img 
                            src={preview} 
                            alt="Preview" 
                            className="w-full h-full object-contain" 
                        />
                    )}
                    
                    <button 
                        onClick={() => { setPreview(null); setImage(null); }}
                        className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"
                    >
                        <AiOutlineClose />
                    </button>
                </div>
            ) : (
                <div className="w-full h-40 bg-gray-800 rounded-lg flex flex-col items-center justify-center text-gray-400 gap-2">
                    <FaImage className="text-4xl" />
                    <p className="text-sm">Select photos or videos</p>
                    <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold cursor-pointer transition">
                        Select from computer
                        <input 
                            type="file" 
                            accept="image/*,video/*" 
                            className="hidden" 
                            onChange={handleImageChange} 
                        />
                    </label>
                </div>
            )}

            {/* Caption Input */}
            <textarea 
                className="w-full bg-transparent text-white focus:outline-none resize-none" 
                rows="3"
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
            />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 flex justify-end">
            <button 
                onClick={handleSubmit} 
                disabled={isLoading}
                className="text-blue-500 font-bold hover:text-white transition disabled:opacity-50"
            >
                {isLoading ? "Sharing..." : "Share"}
            </button>
        </div>

      </div>
    </div>
  );
};

export default CreatePostModal;