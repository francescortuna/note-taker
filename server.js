const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3001;

const app = express();

// GET request for landing page
app.get('/', (req,res) =>
    res.sendFile(path.join(__dirname,'./public/index.html'))
);

// GET request for notes page
app.get('/notes', (req,res) =>
    res.sendFile(path.join(__dirname,'./public/notes.html'))
);

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);