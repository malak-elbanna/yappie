import React, {useState, useEffect} from "react";
import { getProfilePage, editBio, addPreference, removePreference, removeFavoriteBook } from "../Api";
import { Hourglass } from 'ldrs/react';
import 'ldrs/react/Hourglass.css';
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [userInfo, setUserInfo] = useState({name: "", email: ""});
    const [editingBio, setEditingBio] = useState(false);
    const [userId, setUserId] = useState(null);
    const [newBio, setNewBio] = useState("");
    const [newPreference, setNewPreference] = useState({ genre: "" });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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

    const handleRemoveFavorite = async(bookCover) => {
        try {
            await removeFavoriteBook(userId, bookCover);
            
        } catch (error) {
            console.error("Error removing favorite book ", error);
        } finally {
            window.location.href = "/profile";
        }
    }

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
            <div className="absolute bottom-0 right-0 w-[400px] h-[200px] bg-indigo-600/15 blur-[80px] rounded-full pointer-events-none z-0" />
            <div className="relative z-10 max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm shadow-lg border border-gray-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-3xl -z-10" />
                    <div className="flex flex-col md:flex-row gap-6 p-6">
                    <div className="w-full md:w-1/3 space-y-6">
                    <div className="relative group">
                        <img
                        className="w-32 h-32 mx-auto rounded-full shadow-lg border-4 border-purple-500/30 group-hover:border-purple-500/60 transition-all duration-300"
                        src="https://i.pravatar.cc/300"
                        alt="User Avatar"
                        />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-100">{userInfo.name}</h2>
                        <p className="text-sm text-gray-400 mt-1">{userInfo.email}</p>
                    </div>
                    {editingBio ? (
                    <div className="space-y-4 animate-fadeIn">
                        <textarea
                            value={newBio}
                            onChange={(e) => setNewBio(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-700/80 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            rows={4}
                            placeholder="Tell us about yourself..."
                        />
                        <div className="flex gap-3">
                            <button
                            onClick={handleBioUpdate}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/20 disabled:opacity-70"
                            disabled={isLoading}
                            >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                Updating...
                                </span>
                            ) : "Save Bio"}
                            </button>
                            <button
                            onClick={() => setEditingBio(false)}
                            className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors duration-200"
                            >
                            Cancel
                            </button>
                        </div>
                    </div>
                    ) : (
                        <div className="space-y-4 animate-fadeIn">
                            <p className="text-gray-300 text-center px-2">{profile.bio || "No bio yet. Tell us about yourself!"}</p>
                            <button
                                onClick={() => setEditingBio(true)}
                                className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            Edit Bio
                            </button>
                        </div>
                    )}

                </div>

                <div className="flex-1 bg-gray-800/40 rounded-2xl p-6 border border-gray-700/50">
                    <h3 className="text-xl font-semibold text-gray-100 mb-4">Add a Preference</h3>
                    <div className="flex gap-3 mb-6">
                        <input
                            type="text"
                            value={newPreference.genre}
                            onChange={(e) => setNewPreference({ genre: e.target.value })}
                            placeholder="Enter genre (e.g. Mystery, Sci-Fi)"
                            className="flex-grow px-4 py-3 rounded-xl bg-gray-700/80 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                        <button
                            onClick={handleAddPreference}
                            disabled={isLoading || !newPreference.genre}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Adding..." : "Add"}
                        </button>
                    </div>

                    {profile.preferences?.audiobooks && profile.preferences.audiobooks.length > 0 && (
                        <div className="mt-6 animate-fadeIn">
                            <h4 className="text-lg font-semibold text-gray-100 mb-3">Your Audiobook Preferences</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {profile.preferences.audiobooks.map((genre) => (
                                <div key={genre} className="flex items-center justify-between bg-gray-700/50 hover:bg-gray-700/70 rounded-lg px-4 py-3 transition-colors duration-200">
                                    <span className="text-gray-200 font-medium">{genre}</span>
                                        <button
                                            onClick={() => handleRemovePreference(genre)}
                                            className="text-red-400 hover:text-red-300 transition-colors duration-200 p-1 rounded-full hover:bg-red-500/10"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                </div>
                            ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm shadow-lg border border-gray-700">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-100">Favorite Books</h3>
                    </div>

                    {profile?.favorite_books?.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {profile.favorite_books.map((book, index) => (
                                <div 
                                    key={`${book}-${index}`} 
                                    className="group relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-700/50 hover:bg-gray-700/70 transition-colors duration-200"
                                >
                                    <img
                                        src={book}
                                        alt="Favorite book cover"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                        <button className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full hover:bg-red-500/80 transition-colors duration-200"
                                            onClick={() => handleRemoveFavorite(book)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <div className="mx-auto w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-medium text-gray-300 mb-2">No favorite books yet</h4>
                            <p className="text-gray-500 max-w-md mx-auto">Add your favorite books to build your personalized collection</p>
                            <button className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300" onClick={() => navigate('/books')}>
                                Browse Books
                            </button>
                        </div>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
};

export default Profile;