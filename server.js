const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');
const { v4:uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for serving static files
app.use(express.static('public'));

// GET request for notes file
app.get('/api/notes', (req,res) => {
    res.json(notes)
});

// GET request for notes page
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname,'./public/notes.html'))
});

// GET request for landing page
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'))
});

// POST request to add a note
app.post('/api/notes', (req,res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    // Destructuring items in request body
    const { title, text } = req.body;

    if(title && text) { // Checks to see that all required properties are present
        // Variable for the object
        const newNotes = {
            title,
            text,
            id: uuidv4()
        };

        // Get existing reviews
        fs.readFile('./db/db.json','utf8', (err,data) => {
            if(err) {
                console.log(err)
            } else {
                const parsedNotes = JSON.parse(data);

                // Add new note
                parsedNotes.push(newNotes);

                // Write updated reviews
                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) => writeErr ? console.log(writeErr) : console.log('Successfully updated notes!'));
            }
        });
    }
});

app.delete('/api/notes/:id', (req, res) => {
    for(let i = 0; i<notes.length; i++) {
        if(notes[i].id == req.params.id) {
            notes.splice(i,1);
            fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (writeErr) => writeErr ? console.log(writeErr) : console.log('Successfully updated notes!'));
        }
    }
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);