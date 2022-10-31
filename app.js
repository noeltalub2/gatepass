const express = require("express");
const mysql = require("mysql2"); //built in promise
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const app = express();
const PORT = 3000;

const student = require("./routes/student")

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

//Create database connection
// const conn = mysql.createConnection({
// 	host: "localhost",
// 	user: "root",
// 	password: "", 
// 	database: "gatepass",
// });

// //Check if the database is working
// conn.connect((err) => {
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log("Database connected");
// 	}
// });
//



app.get("/login", (req, res) => {
	res.render("login");
});


app.use("/student",student)


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

app.get("/signup", async (req, res) => {
	res.render("signup", { msg: "error" });
});



app.listen(PORT, () => {
	console.log("Server is running");
});
