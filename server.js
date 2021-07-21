const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3001;
const path = require('path');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route for static files
app.use(express.static('public'));

// Route for /notes
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public', 'notes.html')));

// Route for GET /api/notes
app.get('/api/notes', function(req, res) {
    // Read db.json file and return all notes
    fs.readFile('db/db.json', 'utf8', function (error, data) {
        if (error) {
            console.error(error);
            res.end();
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Fallback route that returns the index.html
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () =>
    console.log(`Started server on port http://localhost:${PORT}`)
);
