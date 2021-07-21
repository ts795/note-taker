const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const generateUniqueId = require('generate-unique-id');

const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

// Route for static files
app.use(express.static('public'));

// Route for /notes
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public', 'notes.html')));

// Route for GET /api/notes
app.get('/api/notes', function (req, res) {
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

// Route for POST /api/notes
app.post('/api/notes', function (req, res) {
    var newNote = req.body;
    // Assign a unique ID for the note
    newNote.id = generateUniqueId();
    // Save the note in the JSON file
    fs.readFile('db/db.json', 'utf8', function (error, data) {
        if (error) {
            console.error(error);
            res.end();
        } else {
            var allNotes = JSON.parse(data);
            allNotes.push(newNote);
            // Write out the notes
            fs.writeFile('db/db.json', JSON.stringify(allNotes), function (err) {
                if (err) {
                    console.error(err);
                    res.end();
                } else {
                    // Return the new note
                    res.json(newNote);
                }
            });
        }
    });
});

// Route for deleting a note
app.delete('/api/notes/:id', function (req, res) {
    var idOfNoteToDelete = req.params.id;

    // Get the notes from the JSON file
    fs.readFile('db/db.json', 'utf8', function (error, data) {
        if (error) {
            console.error(error);
            res.end();
        } else {
            var allNotes = JSON.parse(data);
            // Filter out the note to be deleted
            allNotes = allNotes.filter(note => note.id !== idOfNoteToDelete);
            // Write out the notes
            fs.writeFile('db/db.json', JSON.stringify(allNotes), function (err) {
                if (err) {
                    console.error(err);
                }
                res.end();
            });
        }
    });
});

// Fallback route that returns the index.html
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () =>
    console.log(`Started server on port http://localhost:${PORT}`)
);
