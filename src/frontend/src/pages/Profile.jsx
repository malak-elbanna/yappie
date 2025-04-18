import React, {useState, useEffect} from "react";
import { getProfilePage } from "../Api";
const Profile = () => {
    const [profile, setProfile] = useState(null);
    useEffect(() => {
        let userId = null;
        try {
            const token = sessionStorage.getItem("token");
            if (token) {
                const payloadBase64 = token.split('.')[1];
                const decodedPayload = JSON.parse(atob(payloadBase64));
                userId = decodedPayload.sub;
            }
        } catch (error) {
        console.error("Invalid token:", error);
        }
        if (userId) {
            getProfilePage(userId).then(data => {
                setProfile(data);
            }).catch(err => console.error(err));
        }
    }, []);

    if (!profile) return <div>Loading...</div>

    return (
        <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Welcome, {profile.name}</h1>
        <p className="mb-4"><strong>Bio:</strong> {profile.bio || "No bio yet"}</p>
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
            <div className="mb-4">
                <h2 className="text-xl font-semibold">Preferences</h2>
                {Object.entries(profile.preferences).map(([type, genres]) => (
                    <div key={type} className="mb-2">
                        <h3 className="font-semibold capitalize">{type}</h3>
                        <ul className="list-disc list-inside">
                            {genres.map((genre) => (
                                <li key={`${type}-${genre}`}>{genre}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
