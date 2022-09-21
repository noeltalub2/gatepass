const express = require("express");
const mysql = require("mysql2"); //built in promise
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const app = express();
const PORT = 3000;

//Middleware
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
//
app.get("/", (req, res) => {
	res.render("login");
});

// Database query promises

// async function getInfo(sql,data){
// 	var sql = "SELECT a from b where info = data"
// 	const results = await conn.promise().query(sql)
// 	return results[0]
//   }

const zeroParamPromise = (sql) => {
	return new Promise((resolve, reject) => {
		db.query(sql, (err, results) => {
			if (err) return reject(err);
			return resolve(results);
		});
	});
};

const queryParamPromise = (sql, queryParam) => {
	return new Promise((resolve, reject) => {
		conn.query(sql, queryParam, (err, results) => {
			if (err) return reject(err);
			return resolve(results);
		});
	});
};

app.get("/register", async (req, res) => {
	res.render("register", { msg: "error" });
});

app.post("/register", async (req, res) => {
	//Data from the form ./register
	const { student_number, lastname, firstname, email,phonenumber, password } = req.body;

	// Catch any error
	let error = [];

	var sql =
		"Select count(*) as `count` from student_acc where student_number = ?";

	//To encrypt the password using hash
	const salt = bcrypt.genSaltSync(15);
	const hash = bcrypt.hashSync(password, salt);
	var data = {
		student_number: student_number,
		firstname: firstname,
		lastname: lastname,
		email: email,
		phonenumber:phonenumber,
		password: hash,
	};

	var sql1 = "Insert into student_acc set ?";
	var query = conn.query(sql1, data, (err, rset) => {
		if (err) {
			console.log(err);
			res.render("register", { msg: "error" });
		} else {
			res.render("register", { msg: "success" });
		}
	});
});

app.listen(PORT, () => {
	console.log("Server is running");
});
