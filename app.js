const express = require("express");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const cookieSession = require("cookie-session");
const path = require("path");

const dotenv = require("dotenv")
dotenv.config()

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
//


//Database
const db = require("./db/db.js")
db.getConnection((err, connection) => {
	if (err) throw err;
	console.log("Database connected successfully");
	connection.release();
});

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




app.use(
	cookieSession({
		name: "session",
		keys: [process.env.SESSION_SECRET],
		cookie: {
			secure: true,
			httpOnly: true,
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


app.listen(process.env.PORT || 3000, () => {
	console.log("Server is running");
});
