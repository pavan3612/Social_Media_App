import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import api from "../config/api";
import { AiOutlineSearch, AiOutlineSend } from "react-icons/ai";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs"; // <--- CHANGED THIS IMPORT

const MessagePage = () => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // WebSocket Reference
  const stompClient = useRef(null);

  // 1. Initial Load (Keep unchanged)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get("/api/user/profile");
        setUser(profileRes.data);
        const chatRes = await api.get("/api/chats");
        setChats(chatRes.data);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };
    fetchData();
  }, []);

  // 2. Connect to WebSocket & Fetch History
  useEffect(() => {
    // Cleanup old connection
    if (stompClient.current) {
        stompClient.current.deactivate();
    }

    if (currentChat && user) {
      // Fetch History
      const fetchMessages = async () => {
        try {
          const { data } = await api.get(`/api/messages/chat/${currentChat.id}`);
          setMessages(data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchMessages();

      // --- NEW WEBSOCKET LOGIC ---
      const client = new Client({
          // We use webSocketFactory because the backend uses SockJS
          webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
          onConnect: () => {
              console.log("Connected to WebSocket");
              
              // Subscribe to the chat topic
              client.subscribe(`/chat/${currentChat.id}`, (message) => {
                  const receivedMessage = JSON.parse(message.body);
                  setMessages((prev) => [...prev, receivedMessage]);
              });
          },
          onStompError: (frame) => {
              console.error("Broker reported error: " + frame.headers["message"]);
          }
      });

      // Activate the client
      client.activate();
      stompClient.current = client;
    }

    // Cleanup on unmount
    return () => {
        if (stompClient.current) {
            stompClient.current.deactivate();
        }
    };
  }, [currentChat, user]);
  

  // 3. Search Users (Keep unchanged)
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value === "") { setSearchResults([]); return; }
    try {
      const { data } = await api.get(`/api/users/search?query=${value}`);
      setSearchResults(data);
    } catch (error) {}
  };

  // 4. Create Chat (Keep unchanged)
  const handleClickUser = async (targetUserId) => {
    try {
      const { data } = await api.post("/api/chats", { userId: targetUserId });
      setCurrentChat(data);
      console.log("this is message triggered when then user click chat");
      setSearchResults([]);
      setQuery("");
      if (!chats.find(c => c.id === data.id)) setChats([data, ...chats]);
    } catch (error) {}
  };

  // 5. Send Message (Keep unchanged)
  const handleSendMessage = async () => {
      if (!newMessage.trim() || !currentChat) return;
      try {
        await api.post(`/api/messages/chat/${currentChat.id}`, {
          content: newMessage,
          image: null 
        });
        setNewMessage(""); 
      } catch (error) {
        console.error("Error sending message:", error);
      }
  };

  const getChatPartner = (chat) => {
      if(!user || !chat.users) return null;
      return chat.users.find((u) => u.id !== user.id);
  };
  

  return (
    <div className="bg-black min-h-screen text-white flex">
      <Sidebar user={user} />

      <div className="w-[80%] flex h-screen overflow-hidden">
        {/* --- LEFT COLUMN --- */}
        <div className="w-1/3 border-r border-gray-700 bg-gray-900 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Search users to chat..." 
                    className="w-full bg-gray-800 rounded-full py-2 px-10 focus:outline-none"
                    value={query}
                    onChange={handleSearch}
                />
                <AiOutlineSearch className="absolute top-3 left-3 text-gray-400"/>
            </div>
            {searchResults.length > 0 && (
                <div className="absolute z-10 bg-gray-800 w-64 mt-2 rounded shadow-lg border border-gray-700 max-h-60 overflow-y-auto">
                    {searchResults.map((result) => (
                        <div key={result.id} onClick={() => handleClickUser(result.id)} className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">{result.firstName[0]}</div>
                            <div><p className="text-sm font-bold">{result.firstName} {result.lastName}</p></div>
                        </div>
                    ))}
                </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <h2 className="text-gray-400 text-xs font-bold uppercase p-4">Messages</h2>
            {chats.length > 0 ? chats.map((chat) => {
                const partner = getChatPartner(chat);
                return (
                    <div key={chat.id} onClick={() => setCurrentChat(chat)} className={`flex items-center gap-3 p-4 cursor-pointer transition ${currentChat?.id === chat.id ? 'bg-gray-800' : 'hover:bg-gray-800'}`}>
                        <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center font-bold text-xl">
                            {partner?.image ? <img src={partner.image} alt="" className="w-full h-full object-cover"/> : partner?.firstName[0]}
                        </div>
                        <div>
                            <p className="font-bold">{partner ? `${partner.firstName} ${partner.lastName}` : "Unknown User"}</p>
                            <p className="text-sm text-gray-400 truncate">Tap to chat</p>
                        </div>
                    </div>
                  
                );
            }) : <p className="text-gray-500 text-center mt-10 text-sm">Search a user to start chatting</p>}
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="w-2/3 bg-black flex flex-col relative">
            {currentChat && user ? (
                <>
                    <div className="p-4 border-b border-gray-700 flex items-center gap-3 bg-gray-900">
                         <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold">{getChatPartner(currentChat)?.firstName[0]}</div>
                         <h2 className="font-bold text-lg">{getChatPartner(currentChat)?.firstName} {getChatPartner(currentChat)?.lastName}</h2>
                    </div>
                   {/* Messages Area */}
                   <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
  {messages.map((msg) => {
    // 1. Determine if the current logged-in user sent this message
    // We use String() to ensure that 5 (number) equals "5" (string)
    const isSender =
      msg.user?.id && user?.id
        ? String(msg.user.id) === String(user.id)
        : false;

    return (
      <div
        key={msg.id}
        // 2. PARENT DIV: Controls Alignment (Left vs Right)
        className={`flex w-full ${isSender ? "justify-end" : "justify-start"}`}
      >
        <div
          // 3. MESSAGE BUBBLE: Controls Color and Shape
          className={`max-w-[70%] p-3 rounded-2xl text-sm md:text-base shadow-sm ${
            isSender
              ? "bg-purple-600 text-white rounded-tr-none" // Sender: Purple, sharp top-right corner
              : "bg-gray-800 text-white rounded-tl-none"   // Receiver: Gray, sharp top-left corner
          }`}
        >
          <p>{msg.content}</p>

          {/* Timestamp */}
          <p className="text-[10px] text-gray-300 mt-1 text-right">
            {msg.timeStamp
              ? new Date(msg.timeStamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </p>
        </div>
      </div>
    );
  })}
</div>
                    <div className="p-4 bg-gray-900 flex gap-4 items-center">
                        <input type="text" className="w-full bg-gray-800 text-white rounded-full py-3 px-5 focus:outline-none" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}/>
                        <button onClick={handleSendMessage} className="text-blue-500 text-2xl p-2 hover:bg-gray-800 rounded-full"><AiOutlineSend /></button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-6xl mb-4">💬</div>
                    <h2 className="text-2xl font-bold">Your Messages</h2>
                    <p className="text-gray-400">Select a chat to start messaging</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MessagePage;