const express = require("express");
const mysql = require("mysql2"); //built in promise
const cookieParser = require("cookie-parser");

//Routes
const student = require("./routes/student");


const dotenv = require("dotenv");
dotenv.config()


const app = express();

//Middleware
app.use(cookieParser())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

//Create database connection
const conn = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "gatepass",
});

//Check if the database is working
conn.connect((err) => {
	if (err) {
		console.log(err);
	} else {
		console.log("Database connected");
	}
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.use("/student", student);


PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log("Server is running");
});
