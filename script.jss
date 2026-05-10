
// script.js

const API = "http://127.0.0.1:5000";

let editId = null;

async function saveNote(){

    const input = document.getElementById("noteInput");

    const note = input.value;

    if(note.trim() === ""){
        alert("Write something!");
        return;
    }

    if(editId){

        await fetch(`${API}/update/${editId}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                note:note
            })
        });

        editId = null;

    }else{

        await fetch(`${API}/add`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                note:note
            })
        });
    }

    input.value = "";

    loadNotes();
}

async function loadNotes(){

    const response = await fetch(`${API}/notes`);

    const notes = await response.json();

    const container =
        document.getElementById("notesContainer");

    container.innerHTML = "";

    notes.reverse().forEach(note => {

        const div = document.createElement("div");

        div.className = "note-card";

        div.innerHTML = `
            <div class="note-header">

                <h3>📌 Note</h3>

                <div class="note-actions">

                    <button
                        class="edit-btn"
                        onclick="editNote(${note.id}, '${note.note}')"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteNote(${note.id})"
                    >
                        Delete
                    </button>

                </div>

            </div>

            <p class="note-text">
                ${note.note}
            </p>

            <p class="note-date">
                ${note.date}
            </p>
        `;

        container.appendChild(div);
    });
}

async function deleteNote(id){

    await fetch(`${API}/delete/${id}`,{
        method:"DELETE"
    });

    loadNotes();
}

function editNote(id,note){

    document.getElementById("noteInput").value =
        note;

    editId = id;
}

function searchNotes(){

    const input =
        document.getElementById("searchInput")
        .value
        .toLowerCase();

    const notes =
        document.querySelectorAll(".note-card");

    notes.forEach(note => {

        const text =
            note.innerText.toLowerCase();

        if(text.includes(input)){
            note.style.display = "block";
        }else{
            note.style.display = "none";
        }
    });
}

function toggleDarkMode(){

    document.body.classList.toggle("dark-mode");
}

loadNotes();