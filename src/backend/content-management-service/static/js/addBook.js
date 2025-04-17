function addAudiobook() {
    const form = document.getElementById("add-audiobook-form");
    const formData = new FormData(form);
    const message = {
        topic:"author",
    }
    console.log(formData);
    fetch("/api/content", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert("Audiobook added successfully.");
        } else {
            alert("Failed to add audiobook.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert(`An error occured while adding the audiobook. ${error}`);
    });
    var object = {};
    formData.forEach((value, key) => object[key] = value);
    var json = JSON.stringify(object);
        
    fetch("http://notification-service:4000/notification/admin", {
        method: "POST",
        body: json
    })
    .then(response => {
        if (response.ok) {
            window.location.href = "/api/content";
        } else {
            alert("Failed to add notification.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });

}