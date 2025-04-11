import React, {useState} from "react";
import { add_book } from "../Api";

const DashboardAdmin = () => {
    const [data, setData] = useState({
        title:"",
        description: "",
        author: "",
        langauge: "",
        url_rss: "",
        url_librivox:"",
        totaltime: "",
        cover_url: "",
        chapters: [],
        category: "",
    });
    const [message, setMessage] = useState("");
    const handleChange = (e) => {
        const {name, value} = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...data,
                chapters: data.chapters.length ? data.chapters.split(",") : [],
            };
            await add_book(dataToSend);
            setMessage("book added");
            setData({
                title: "",
                description: "",
                author: "",
                language: "",
                url_rss: "",
                url_librivox: "",
                totaltime: "",
                cover_url: "",
                chapters: [],
                category: "",
            });
        } catch (error) {
            setMessage("failed to add book");
            console.error("add book error: ", error);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Add New Audiobook</h2>
        {message && <p className="mb-4 text-green-600">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(data).map(([key, value]) => (
            <div key={key}>
                <label className="block text-gray-700 capitalize">{key}</label>
                <input
                type="text"
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                placeholder={`Enter ${key}`}
                />
                {key === "chapters" && (
                <small className="text-gray-500">
                    (comma-separated values)
                </small>
                )}
            </div>
            ))}
            <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
            Add Book
            </button>
        </form>
    </div>
    );
};

export default DashboardAdmin;
