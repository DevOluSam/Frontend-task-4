const editNoteModal = document.getElementById('editNoteModal');
editNoteModal.style.display = 'none';



function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}


let currentPage = 1;
const itemsPerPage = 5;
let totalPages;

document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.edit-note-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Find the hidden input field in the same parent div
            const noteId = this.closest('.note').querySelector('.note-id').value;
            console.log(noteId);
            openModal('editNoteModal', noteId);
            fetch(`/notes/get/${noteId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => {
                    if (!response.ok) {
                    throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    const editForm = document.getElementById('editNoteForm');
                    document.getElementById('editTitle').value = data.note.title;
                    document.getElementById('editDescription').value = data.note.description;
                    document.getElementById('editStatus').value = data.note.status;
                    document.getElementById('editDueDate').value = data.note.dueDate;
                    
                    // console.log('Note details:', data.note);

                    editForm.addEventListener('submit', function (event) {
                                event.preventDefault();
                        
                                // Collect the updated values from the form
                                const updatedTitle = editForm.querySelector('#editTitle').value;
                                console.log(updatedTitle);
                                const updatedDescription = editForm.querySelector('#editDescription').value;
                                const updatedStatus = editForm.querySelector('#editStatus').value;
                                const updatedDueDate = editForm.querySelector('#editDueDate').value;
                        
                                // Send a PATCH or PUT request to update the note on the server
                                fetch(`/notes/update/${noteId}`, {
                                    method: 'PUT', 
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        title: updatedTitle,
                                        description: updatedDescription,
                                        status: updatedStatus,
                                        dueDate: updatedDueDate,
                                    }),
                                })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Network response was not ok');
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    console.log('Note updated successfully:', data);
                                    // Optionally, you can close the modal or handle the success in another way
                                })
                                const successMessage = document.getElementById('successMessage');
                                    successMessage.textContent = 'Note updated successfully';
                                    successMessage.style.display = 'block';

                                    // Hide success message after 5 seconds
                                    setTimeout(() => {
                                        successMessage.style.display = 'none';
                                    }, 1000);

                                    // Optionally, you can close the modal or handle the success in another way
                                    closeModal('editNoteModal');

                                    // Refresh the dashboard after a delay (5 seconds)
                                    setTimeout(() => {
                                        location.reload(); // Reload the current page
                                    }, 2000);
                                
                                        })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
                        });
                    });
});
});



function openModal(modalId, noteId) {
    const modal = document.getElementById(modalId);
    
    if (modal) {
        modal.style.display = 'flex';   
    }
}


// const addNoteForm = document.getElementById('addNoteForm');
// addNoteForm.addEventListener('submit', function (event) {
//     event.preventDefault();

//     // Collect the values from the form
//     const title = addNoteForm.querySelector('#addTitle').value;
//     const description = addNoteForm.querySelector('#addDescription').value;
//     const status = addNoteForm.querySelector('#addStatus').value;
//     const dueDate = addNoteForm.querySelector('#addDueDate').value;

//     // Send a POST request to create a new note
//     fetch('/notes/create', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             Title: title,
//             Description: description,
//             Status: status,
//             DueDate: dueDate,
//         }),
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Note created successfully:', data);
//     })
//     .catch(error => {
//         console.error('There was a problem with the fetch operation:', error);
//     });
// });






const deleteNoteModal = document.getElementById('deleteNoteModal');
deleteNoteModal.style.display = 'none';

const deleteButtons = document.querySelectorAll('.delete-note-btn');
deleteButtons.forEach(button => {
    button.addEventListener('click', function () {
        // Find the hidden input field in the same parent div
        // const noteId = this.closest('.note').querySelector('.note-id').value;
        const noteId = this.closest('.note').querySelector('.note-id').value;
        openModal('deleteNoteModal', noteId);
        console.log('line 177-Note ID:', noteId);
        
    // });




// Assuming you have a delete button inside your deleteNoteModal


const deleteNoteForm = document.getElementById('deleteNoteForm');
deleteNoteForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Send a DELETE request to delete the note
    fetch(`/notes/delete/${noteId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Note deleted successfully:', data);

        // Optionally, you can close the modal or handle the success in another way
        closeModal('deleteNoteModal');

    
        setTimeout(() => {
            location.reload(); // Reload the current page
        }, 2000);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});
});
});

