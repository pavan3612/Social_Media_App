import React from "react";
import { useNavigate } from "react-router-dom";
import { AiFillHome, AiOutlineSearch, AiFillMessage, AiOutlineFileText } from "react-icons/ai";
import { MdOutlineExplore, MdAddCircleOutline } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoIosNotifications } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";

const Sidebar = ({ user }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <AiFillHome className="text-2xl" />, label: "Home", path: "/home" },
    { icon: <AiOutlineSearch className="text-2xl" />, label: "Search", path: "/search" },
    { icon: <MdOutlineExplore className="text-2xl" />, label: "Reels", path: "/reels" },
    { icon: <MdAddCircleOutline className="text-2xl" />, label: "Create Reels", path: "/create-reels" },
    
    // FIX: Changed icon to FileText, fixed typo 'text-2x1' -> 'text-2xl', and path to lowercase
    { icon: <AiOutlineFileText className="text-2xl"/>, label: "Make Notes", path: "/notes"},
    
    { icon: <AiFillMessage className="text-2xl" />, label: "Messages", path: "/message" },
    { icon: <IoIosNotifications className="text-2xl" />, label: "Notifications", path: "/notifications" },
    { icon: <CgProfile className="text-2xl" />, label: "Profile", path: `/profile/${user?.id}` },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="sticky top-0 h-screen px-6 py-6 border-r border-gray-700 w-[20%] flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-bold text-blue-500 mb-10 font-sans cursor-pointer" onClick={() => navigate("/home")}>
            Learn Insta
        </h1>
        <div className="space-y-4">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleNavigate(item.path)}
              className="flex items-center gap-4 text-white cursor-pointer hover:bg-gray-800 p-3 rounded-lg transition duration-200"
            >
              {item.icon}
              <span className="text-lg font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User Profile at Bottom Left */}
      {user && (
        <div 
            onClick={() => navigate(`/profile/${user.id}`)} 
            className="flex items-center justify-between cursor-pointer hover:bg-gray-800 p-3 rounded-lg transition"
        >
          <div className="flex items-center gap-3">
            
            {/* --- FIX: ADDED IMAGE CHECK HERE --- */}
            <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 to-fuchsia-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
              {user.image ? (
                  <img src={user.image} alt="" className="w-full h-full object-cover" />
              ) : (
                  <span>{user.firstName ? user.firstName[0].toUpperCase() : "U"}</span>
              )}
            </div>
            {/* ----------------------------------- */}

            <div className="text-white">
              <p className="font-semibold text-sm">{user.firstName} {user.lastName}</p>
              <p className="text-gray-400 text-xs">
                  @{user.firstName ? user.firstName.toLowerCase() : ""}
              </p>
            </div>
          </div>
          <BsThreeDots className="text-white" />
        </div>
      )}
    </div>
  );
};

export default Sidebar;