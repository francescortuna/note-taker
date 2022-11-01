const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');
const dataFile = './db/db.json';
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
    fs.readFile(path.join(__dirname, dataFile),'utf8', (err,data) => {
        if(err) {
            console.log(err)
        } else {
            res.json(JSON.parse(data));
        }
    })
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

        fs.readFile(dataFile, 'utf8', (err, data) => {
            if (err) {
              console.error(err);
            } else {
              const parsedData = JSON.parse(data);
              parsedData.push(newNotes);
              
              fs.writeFile(dataFile, JSON.stringify(parsedData, null, 4), (err) =>
                err ? console.error(err) : console.info(`\nData written to ${dataFile}`));
          }});

        res.json(`New note added successfully!`);
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const deleteID = req.params.id;
    fs.readFile(dataFile,'utf8', (err,data) => {
        if(err) {
            console.error(err);
        } else {
            let notesArray = JSON.parse(data);
            for(let i = 0; i<notesArray.length; i++) {
                if(notesArray[i].id == deleteID) {
                    notesArray.splice(i,1);

                    fs.writeFile(dataFile, JSON.stringify(notesArray, null, 4), (err) => {
                        err ? console.error(err) : console.info(`\nData written to ${dataFile}`)
                    })
                }
            }
        }
    });

    res.json('Note deleted successfully!');
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);