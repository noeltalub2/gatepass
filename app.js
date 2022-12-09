const express = require("express");
const mysql = require("mysql2"); //built in promise
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const cookieSession = require("cookie-session");
const path = require("path");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
//
const dotenv = require("dotenv");
dotenv.config();

//Routes
const student = require("./routes/student");
const faculty = require("./routes/faculty");
const admin = require("./routes/admin");
const home = require("./routes/home");
//

//Create database connection

// const conn = mysql.createConnection({
// 	host: "localhost",
// 	user: "root",
// 	password: "",
// 	database: "gatepass",
// });

const conn = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	connectTimeout:2000000,
});

//Check if the database is working
conn.connect((err) => {
	if (err) {
		console.log(err);
	} else {
		console.log("Database connected");
	}
});



app.use(
	cookieSession({
		name: "session",
		keys: [process.env.SESSION_SECRET],
		cookie: {
			secure: true,
			httpOnly: true,
			expires: 24 * 60 * 60 * 1000,
		},
	})
);

app.use(flash());

// Global variables
app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	next();
});

//Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/student", student);
app.use("/faculty", faculty);
app.use("/admin", admin);

app.use("/", home);

// Home Page
app.use(home);

PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log("Server is running");
});
