const updateAudiobook = () => {
    const id = window.location.pathname.split("/").pop();

    if (!id || id === 'undefined') {
        alert('Invalid audiobook ID');
        return;
    }

    const updatedData = {
        title: "Updated title",
        author: "Updated author",
        description: "Updated description",
        language: "Updated language",
        url_rss: "Updated URL RSS",
        url_librivox: "Updated URL Librivox",
        totaltime: "Updated Total Time",
        cover_url: "Updated Cover URL",
        chapters: "Updated Chapters",
        category: "Updated Category"
    };

    fetch(`/api/content/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        window.location.href = '/api/content';
    })
    .catch(error => console.error('Error:', error));
};
