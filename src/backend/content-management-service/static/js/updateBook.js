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
            alert("Audiobook updated successfully.");
            window.location.href = "/api/content";
        } else {
            alert("Failed to update audiobook.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occured while updating the audiobook.");
    });
}
