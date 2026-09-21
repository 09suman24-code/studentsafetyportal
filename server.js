const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve all HTML, CSS and JavaScript files
app.use(express.static(__dirname));


// Home page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


// Register page
app.get("/register.html", (req, res) => {
    res.sendFile(__dirname + "/register.html");
});


// MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


db.connect((err) => {

    if (err) {

        console.log("MySQL connection failed:", err.message);

    } else {

        console.log("MySQL connected successfully!");

        const createTable = `
        CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            phone VARCHAR(15),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;

        db.query(createTable, (err) => {

            if (err) {

                console.log(
                    "Table creation failed:",
                    err.message
                );

            } else {

                console.log("Students table ready!");

            }
        });
    }
});


// Registration
app.post("/register", (req, res) => {

    const {
        name,
        email,
        password,
        phone
    } = req.body;


    if (!name || !email || !password) {

        return res
            .status(400)
            .send("Name, email and password are required");
    }


    const sql = `
        INSERT INTO students
        (name, email, password, phone)
        VALUES (?, ?, ?, ?)
    `;


    db.query(
        sql,
        [name, email, password, phone],
        (err, result) => {

            if (err) {

                console.log(
                    "Registration error:",
                    err.message
                );

                return res
                    .status(500)
                    .send(
                        "Registration failed: " +
                        err.message
                    );
            }


            res.send(
                "Student registered successfully!"
            );
        }
    );
});

// Report Incident
app.post("/report-incident", (req, res) => {

    const {
        incidentType,
        incidentLocation,
        incidentDescription
    } = req.body;

    if (!incidentType || !incidentLocation || !incidentDescription) {
        return res.status(400).send("All incident details are required");
    }

    const sql = `
        INSERT INTO incidents
        (incident_type, incident_location, description)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [incidentType, incidentLocation, incidentDescription],
        (err, result) => {

            if (err) {
                console.log("Incident save error:", err.message);
                return res.status(500).send("Incident could not be saved");
            }

            res.send("Incident reported successfully!");
        }
    );
});
//feedback
app.post("/feedback", (req, res) => {

    const { feedback, rating } = req.body;

    const studentId = 1;

    if (!feedback || !rating) {
        return res.status(400).send("Feedback and rating are required.");
    }

    const sql = `
        INSERT INTO feedback (student_id, feedback, rating)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [studentId, feedback, rating],
        (err, result) => {

            if (err) {
                console.log("Feedback save error:", err.message);
                return res.status(500).send("Feedback could not be saved.");
            }

            res.send("Feedback submitted successfully!");
        }
    );
});
// Get Feedback
app.get("/feedback", (req, res) => {

    const sql = `
        SELECT feedback
        FROM feedback
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log("Feedback fetch error:", err.message);
            return res.status(500).json({
                error: "Could not fetch feedback"
            });
        }

        res.json(results);
    });
});

// Start Server
// Save Emergency Contact
// Save Emergency Contact
app.post("/add-contact", (req, res) => {

    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).send("Name and number are required");
    }

    const studentId = 1;

    const sql = `
        INSERT INTO Emergency_contacts
        (student_id, contact_name, contact_number)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [studentId, name, number],
        (err, result) => {

            if (err) {
                console.log("Contact save error:", err.message);
                return res.status(500).send("Contact could not be saved");
            }

            res.send("Emergency contact saved successfully!");
        }
    );
});
// Get Emergency Contacts
app.get("/contacts", (req, res) => {

    const studentId = 1;

    const sql = `
        SELECT id, contact_name, contact_number
        FROM Emergency_contacts
        WHERE student_id = ?
    `;

    db.query(sql, [studentId], (err, results) => {

        if (err) {
            console.log("Contact fetch error:", err.message);
            return res.status(500).json({
                error: "Could not fetch contacts"
            });
        }

        res.json(results);
    });
});
app.listen(PORT, () => {
    console.log("=================================");
    console.log("SERVER STARTED");
    console.log("http://localhost:3000");
    console.log("Register page:");
    console.log("http://localhost:3000/register.html");
    console.log("=================================");
});