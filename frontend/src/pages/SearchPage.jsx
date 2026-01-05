import React, { useState } from "react";
import api from "../config/api";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null); 
  const navigate = useNavigate(); // 2. Initialize Hook

  React.useEffect(() => {
    const fetchUser = async () => {
        try {
            const { data } = await api.get("/api/user/profile");
            setUser(data);
        } catch (e) {
            console.error(e);
        }
    };
    fetchUser();
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === "") {
      setResults([]);
      return;
    }
    try {
      const { data } = await api.get(`/api/users/search?query=${value}`);
      setResults(data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white flex">
      <Sidebar user={user} />

      <div className="w-[80%] flex flex-col items-center py-10 px-6">
        <h1 className="text-3xl font-bold mb-8">Search Users</h1>

        <div className="w-full max-w-2xl mb-10">
            <input 
                type="text" 
                value={query}
                onChange={handleSearch}
                placeholder="Search by name..." 
                className="w-full bg-gray-900 border border-gray-700 rounded-full py-4 px-6 text-white focus:outline-none focus:border-blue-500 text-lg"
            />
        </div>

        <div className="w-full max-w-2xl space-y-4">
            {results.length > 0 ? (
                results.map((resultUser) => (
                    <div key={resultUser.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-800 transition duration-200">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center font-bold text-lg">
                                {resultUser.firstName?.[0]?.toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-lg">{resultUser.firstName} {resultUser.lastName}</p>
                                <p className="text-gray-400 text-sm">@{resultUser.firstName?.toLowerCase()}</p>
                            </div>
                        </div>

                        {/* 3. FIX: Add Navigation Logic */}
                        <button 
                            onClick={() => navigate(`/profile/${resultUser.id}`)}
                            className="px-4 py-2 bg-transparent border border-gray-600 rounded-full text-sm font-semibold hover:border-white transition"
                        >
                            View Profile
                        </button>
                    </div>
                ))
            ) : (
                query && <p className="text-gray-500 text-center mt-10">No users found.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;