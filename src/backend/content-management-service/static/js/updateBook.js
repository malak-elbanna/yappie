function updateAudiobook() {
    const id = document.getElementById("audiobook_id").value;
    const form = document.getElementById("edit-audiobook-form");
    const formData = new FormData(form);

    fetch(`/api/content/${id}`, {
        method: "PUT",
        body: formData
    })
    .then(response => {
        if (response.ok) {
            window.location.href = "/api/content";
        } else {
            alert("Failed to update audiobook.");
        }
    })
    .catch(error => console.error("Error:", error));
}
