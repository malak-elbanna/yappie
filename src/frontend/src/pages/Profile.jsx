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
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Welcome, {userInfo.name}</h1>
            <p className="mb-2"><strong>Email:</strong> {userInfo.email}</p>
            
            <div className="mb-4">
                <div className="flex items-center justify-between">
                    <strong>Bio:</strong>
                    {!editingBio ? (
                        <button 
                            onClick={() => setEditingBio(true)}
                            className="text-sm text-blue-500"
                        >
                            Edit
                        </button>
                    ) : null}
                </div>
                {editingBio ? (
                    <div className="mt-2">
                        <textarea
                            value={newBio}
                            onChange={(e) => setNewBio(e.target.value)}
                            className="w-full p-2 border rounded"
                            rows="3"
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                            <button
                                onClick={() => setEditingBio(false)}
                                className="px-3 py-1 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBioUpdate}
                                className="px-3 py-1 bg-blue-500 text-white rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="mt-1">{profile.bio || "No bio yet"}</p>
                )}
            </div>

            <div className="mb-4">
                <h2 className="text-xl font-semibold">Favorite Books</h2>
                <ul className="list-disc list-inside">
                    {profile.favorite_books.length > 0 ? (
                        profile.favorite_books.map((book) => (
                            <li key={book}>{book}</li>
                        ))
                    ) : (
                        <li>No favorite books added.</li>
                    )}
                </ul>
            </div>
            
            <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold text-gray-800">Audiobook Preferences</h2>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={newPreference.genre}
                            onChange={(e) => setNewPreference({ genre: e.target.value })}
                            placeholder="Enter audiobook genre"
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddPreference()}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleAddPreference}
                            disabled={!newPreference.genre.trim() || isLoading}
                            className={`px-4 py-2 rounded-md ${
                                !newPreference.genre.trim() || isLoading 
                                    ? 'bg-green-300 cursor-not-allowed' 
                                    : 'bg-green-600 hover:bg-green-700'
                            } text-white transition-colors`}
                        >
                            {isLoading ? 'Adding...' : 'Add'}
                        </button>
                    </div>
                </div>
                
                {profile.preferences?.audiobooks?.length > 0 ? (
                    <ul className="space-y-2">
                        {profile.preferences.audiobooks.map((genre, index) => (
                            <li 
                                key={`audiobooks-${index}`} 
                                className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <span className="text-gray-700">{genre}</span>
                                <button
                                    onClick={() => handleRemovePreference(genre)}
                                    disabled={isLoading}
                                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                                    title="Remove genre"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-gray-500">No audiobook genres added yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;