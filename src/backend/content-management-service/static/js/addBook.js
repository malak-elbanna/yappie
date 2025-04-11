function addAudiobook() {
    const form = document.getElementById("add-audiobook-form");
    const formData = new FormData(form);

    fetch("/api/content", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert("Audiobook added successfully.");
            window.location.href = "/api/content";
        } else {
            alert("Failed to add audiobook.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occured while adding the audiobook.");
    });
}