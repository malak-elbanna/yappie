import React, {useState, useEffect} from "react";
import { getProfilePage, editBio, addPreference, removePreference } from "../Api";

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
            }
        };
        fetchData();
    }, []);

    const handleBioUpdate = async () => {
        setIsLoading(true);
        try {
            const updatedProfile = await editBio(userId, { bio: newBio });
            setProfile(updatedProfile);
            setEditingBio(false);
            window.location.reload();
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

    if (!profile) return <div className="text-center py-8">Loading profile...</div>;

    return (
        <div className="min-h-screen text-gray-100" style={{backgroundColor: "#212121"}}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1 space-y-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700" style={{backgroundColor:"#212121", borderColor: "#515151"}}>
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full bg-purple-600 mb-4 flex items-center justify-center text-2xl font-bold text-white">
                                {userInfo.name.charAt(0)}
                            </div>
                            <h2 className="text-xl font-bold text-center text-white">{userInfo.name}</h2>
                            <p className="text-gray-400 text-sm mt-1">{userInfo.email}</p>
                        </div>

                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-gray-300">Bio</h3>
                                <button 
                                    onClick={() => setEditingBio(true)}
                                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                >
                                    Edit
                                </button>
                            </div>
                            {editingBio ? (
                                <div className="mt-2">
                                    <textarea
                                        value={newBio}
                                        onChange={(e) => setNewBio(e.target.value)}
                                        className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                        rows="3"
                                    />
                                    <div className="flex justify-end space-x-2 mt-2">
                                        <button
                                            onClick={() => setEditingBio(false)}
                                            className="px-3 py-1 border border-gray-600 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleBioUpdate}
                                            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                                        >
                                            {isLoading ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400">{profile.bio || "No bio yet"}</p>
                            )}
                        </div>

                        <div className="mt-6">
                            <h3 className="font-semibold mb-2 text-gray-300">Follow</h3>
                            <div className="flex space-x-4">
                                <button className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"></button>
                                <button className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"></button>
                                <button className="w-8 h-8 rounded-full bg-pink-600 hover:bg-pink-700 transition-colors"></button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-lg shadow-lg border border-gray-700" style={{backgroundColor:"#212121", borderColor: "#515151"}}>
                        <h3 className="font-semibold mb-4 text-gray-300">Navigation</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="flex items-center text-gray-400 hover:text-purple-400 transition-colors">
                                    <span className="w-2 h-2 rounded-full bg-purple-400 mr-3"></span>
                                    Audiobooks
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center text-gray-400 hover:text-blue-400 transition-colors">
                                    <span className="w-2 h-2 rounded-full bg-blue-400 mr-3"></span>
                                    Podcasts
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center text-gray-400 hover:text-green-400 transition-colors">
                                    <span className="w-2 h-2 rounded-full bg-green-400 mr-3"></span>
                                    Subscription
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors">
                                    <span className="w-2 h-2 rounded-full bg-yellow-400 mr-3"></span>
                                    Downloads
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center text-gray-400 hover:text-pink-400 transition-colors">
                                    <span className="w-2 h-2 rounded-full bg-pink-400 mr-3"></span>
                                    Playlists
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="md:col-span-3 space-y-6">
                    <div className="p-6 rounded-lg shadow-lg border border-gray-700" style={{backgroundColor:"#212121", borderColor: "#515151"}}>
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-300">Audiobook Preferences</h3>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newPreference.genre}
                                        onChange={(e) => setNewPreference({ genre: e.target.value })}
                                        placeholder="Enter audiobook genre"
                                        className="border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                                        style={{backgroundColor: "#303030", borderColor: "#515151"}}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddPreference()}
                                        disabled={isLoading}
                                    />
                                    <button
                                        onClick={handleAddPreference}
                                        disabled={!newPreference.genre.trim() || isLoading}
                                        className={`px-4 py-2 rounded-md ${
                                            !newPreference.genre.trim() || isLoading 
                                                ? 'bg-green-700 cursor-not-allowed' 
                                                : 'bg-green-600 hover:bg-green-700'
                                        } text-white transition-colors`}
                                    >
                                        {isLoading ? 'Adding...' : 'Add'}
                                    </button>
                                </div>
                            </div>
                            
                            {profile.preferences?.audiobooks?.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {profile.preferences.audiobooks.map((genre, index) => (
                                        <div 
                                            key={`audiobooks-${index}`} 
                                            className="bg-gray-700 px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600 flex justify-between items-center"
                                        >
                                            <span className="text-white">{genre}</span>
                                            <button
                                                onClick={() => handleRemovePreference(genre)}
                                                disabled={isLoading}
                                                className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-gray-500 transition-colors disabled:opacity-50"
                                                title="Remove genre"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-lg p-4 text-center border" style={{backgroundColor: "#303030", borderColor: "#515151"}}>
                                    <p className="text-gray-400">No audiobook genres added yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 rounded-lg shadow-lg border border-gray-700" style={{backgroundColor:"#212121", borderColor: "#515151"}}>
                        <h1 className="text-xl font-bold mb-4 text-white">Your Library</h1>
                        <h2 className="text-xl font-bold mb-4 text-white">Favorite Books</h2>
                        <div className="mb-8">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {profile.favorite_books.length > 0 ? (
                                    profile.favorite_books.map((book) => (
                                        <div key={book} className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors border border-gray-600">
                                            <p className="font-medium text-white">{book}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No favorite books added.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;