// server.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const fs = require('fs');

const app = express();
const port = 3000;

// Use EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files (images) from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Create a MySQL connection pool (replace with your actual database credentials)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Gowshik@123',
    database: 'mydb',
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
});

// Route for the home page
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/verify', (req, res) => {
    const bibNumber = req.body.bibNumber;

    // Query to retrieve data from MySQL
    pool.query('SELECT * FROM bib_data WHERE Bib_No = ?', [bibNumber], (error, results) => {
        if (error) {
            console.error(error);
            res.render('error');
        } else {
            const bibData = results[0];

            if (bibData) {
                // Log the image paths to the console
                console.log('Image Paths:', bibData.Img1, bibData.Img2, bibData.Img3, bibData.Img4, bibData.Img5);

                // If Bib Number is found, render a new page with image paths
                res.render('result', { bibData });
            } else {
                // If Bib Number is not found, render an error page
                res.render('error');
            }
        }
    });
});

// Route to serve images based on paths
app.get('/images/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'public', 'images', imageName);

    // Send the image file if it exists
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        // If the image file does not exist, send a placeholder image or handle it as needed
        res.status(404).sendFile(path.join(__dirname, 'public', 'images', 'placeholder.jpg'));
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
