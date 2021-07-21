const express = require('express');

const app = express();
const PORT = 3001;
const path = require('path');

// Route for static files
app.use(express.static('public'));

// Route for /notes
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public', 'notes.html')));

// Fallback route that returns the index.html
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () =>
  console.log(`Started server on port http://localhost:${PORT}`)
);
