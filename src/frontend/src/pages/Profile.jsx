import React, {useState, useEffect} from "react";
import { getProfilePage, editBio, addPreference, removePreference } from "../Api";
import { Hourglass } from 'ldrs/react';
import 'ldrs/react/Hourglass.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [userInfo, setUserInfo] = useState({name: "", email: ""});
    const [editingBio, setEditingBio] = useState(false);
    const [userId, setUserId] = useState(null);
    const [newBio, setNewBio] = useState("");
    const [newPreference, setNewPreference] = useState({ genre: "" });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
        setIsLoading(true);
        try {
        const token = sessionStorage.getItem("access_token");
        if (token) {
            const [header, payload, signature] = token.split('.');
            const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
            setUserId(decodedPayload.sub);
            setUserInfo({
            name: decodedPayload.name,
            email: decodedPayload.email
            });
    
            const profileData = await getProfilePage(decodedPayload.sub);
            setProfile(profileData);
            setNewBio(profileData.bio || "");
        }
        } catch (error) {
        console.error("Error fetching data:", error);
        } finally {
        setIsLoading(false);
        }
    };
    
    fetchData();
    }, []);
    


    const handleBioUpdate = async () => {
        setIsLoading(true);
        try {
            await editBio(userId, { bio: newBio });
            const refreshed = await getProfilePage(userId); // Re-fetch
            setProfile(refreshed);
            setEditingBio(false);
        } catch (error) {
            console.error("Error updating bio:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleAddPreference = async () => {
        if (!newPreference.genre.trim()) return;
        setIsLoading(true);
        try {
        const updatedProfile = await addPreference(userId, {
            type: "audiobooks",
            genre: newPreference.genre
        });
        setProfile(prev => ({
            ...prev,
            preferences: {
            ...prev.preferences,
            audiobooks: [...(prev.preferences?.audiobooks || []), newPreference.genre]
            }
        }));
        setNewPreference({ genre: "" });
        } catch (error) {
        console.error("Error adding preference:", error);
        } finally {
        setIsLoading(false);
        }
    };

    const handleRemovePreference = async (genre) => {
        setIsLoading(true);
        try {
        await removePreference(userId, {
            type: "audiobooks",
            genre: genre
        });
        setProfile(prev => ({
            ...prev,
            preferences: {
            ...prev.preferences,
            audiobooks: prev.preferences.audiobooks.filter(g => g !== genre)
            }
        }));
        } catch (error) {
        console.error("Error removing preference:", error);
        } finally {
        setIsLoading(false);
        }
    };

    if (isLoading || !profile) return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-purple-600 opacity-25 blur-3xl rounded-full pointer-events-none z-0" />
                <div className="relative z-10 text-center p-8">
                    <Hourglass
                    size="40"
                    bgOpacity="0.1"
                    speed="1.75"
                    color="white" 
                    />
                <h2 className="text-3xl font-bold mb-4">Loading Profile...</h2>
                <p className="text-lg">Please wait while we load your profile data.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-purple-600 opacity-25 blur-3xl rounded-full pointer-events-none z-0" />
                <div className="relative z-10 max-w-6xl w-full bg-gray-900 bg-opacity-60 backdrop-blur-md rounded-2xl shadow-2xl p-8 mx-auto mt-16">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="bg-gray-800 bg-opacity-70 rounded-2xl w-full md:w-1/3 text-center p-6">
                        <img
                        className="w-32 h-32 mx-auto rounded-full shadow-md"
                        src="https://i.pravatar.cc/300"
                        alt="User Avatar"
                        />
                        <h2 className="mt-4 text-2xl font-bold text-gray-200">{userInfo.name}</h2>
                        <p className="text-sm text-gray-400">{userInfo.email}</p>
                {editingBio ? (
                <div>
                    <textarea
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    className="w-full px-4 py-3 mt-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 mb-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    rows={4}
                    placeholder="Update your bio"
                    />
                    <button
                    onClick={handleBioUpdate}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-lg transition"
                    >
                    {isLoading ? "Updating..." : "Save Bio"}
                    </button>
                </div>
                ) : (
                <div>
                    <p className="mt-4 text-gray-300">{profile.bio}</p>
                    <button
                    onClick={() => setEditingBio(true)}
                    className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
                    >
                    Edit Bio
                    </button>
                </div>
                )}

                <div className="flex justify-center gap-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-white transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37..." />
                    </svg>
                </a>
                <a href="#" className="text-purple-600 hover:text-purple-700 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14..." />
                    </svg>
                </a>
                </div>
            </div>

            <div className="flex-1 bg-gray-800 bg-opacity-70 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-200 mb-4">Favorite Books</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {profile?.favorite_books?.length > 0 ? (
                    profile.favorite_books.map((book, index) => (
                    <div key={`${book}-${index}`} className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors border border-gray-600">
                        <p className="font-medium text-white truncate">{book}</p>
                    </div>
                    ))
                ) : (
                    <div className="col-span-full py-8 text-center text-gray-400">
                    {profile ? "No favorite books added yet." : "Loading books..."}
                    </div>
                )}
                </div>

                <h3 className="text-xl font-semibold text-gray-200 mb-2">Add a Preference</h3>
                <div className="flex items-center space-x-2 mb-4">
                <input
                    type="text"
                    value={newPreference.genre}
                    onChange={(e) => setNewPreference({ genre: e.target.value })}
                    placeholder="Enter your genre preference"
                    className="flex-grow px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                    onClick={handleAddPreference}
                    className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                    {isLoading ? "Adding..." : "Add"}
                </button>
                </div>

                {profile.preferences?.audiobooks && (
                <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-200">Your Audiobook Preferences</h4>
                    <ul className="list-disc pl-6 mt-2">
                    {profile.preferences.audiobooks.map((genre) => (
                        <li key={genre} className="text-gray-400 flex justify-between items-center">
                        {genre}
                        <button
                            onClick={() => handleRemovePreference(genre)}
                            className="ml-2 text-red-500 hover:text-red-600 transition"
                        >
                            Remove
                        </button>
                        </li>
                    ))}
                    </ul>
                </div>
                )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;