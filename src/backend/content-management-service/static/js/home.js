function deleteAudiobook(bookId) {
    if (confirm("Are you sure you want to delete this audiobook?")) {
        fetch(`/admin-cms/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                alert("Audiobook deleted successfully.");
                location.reload();
            } else {
                alert("Failed to delete audiobook.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the audiobook.');
        });
    }
}