const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "gatepass",
});

const getLogin = (req, res) => {
	res.render("Student/login", { status_msg: "" });
};

const postLogin = (req, res) => {
	try {
		const { student_number, password } = req.body;
		const findUser = "SELECT * from student WHERE student_number = ?";
		db.query(findUser, [student_number], async (err, result) => {
			if (err) {
				res.render("student/login", { msg: "Authentication Failed" });
			} else {
				if (result.length > 0) {
					const match_password = bcrypt.compare(
						password,
						result[0].password
					);

					if (match_password) {
						res.redirect("student/dashboard");
					} else {
						res.render("student/login", {
							msg: "Student ID and Password does not match",
						});
					}
				} else {
					res.render("student/login", {
						msg: "Could'nt find your account",
					});
				}
			}
		});
	} catch {
		throw err;
	}
};

const getRegister = (req, res) => {
	res.render("Student/register", { status_msg: "" });
};

const postRegister = async (req, res) => {
	//Data from the form ../register
	const {
		studentnumber,
		lastname,
		firstname,
		email,
		phonenumber,
		password,
	} = req.body;

	// Catch any error like duplicate
	let error = [];

	var sid_dupli =
		"Select count(*) as `count` from student where student_number = ?";

	//To encrypt the password using hash
	const salt = bcrypt.genSaltSync(15);
	const hash = bcrypt.hashSync(password, salt);


	
	var data = {
		student_number: studentnumber,
		firstname: firstname,
		lastname: lastname,
		email: email,
		phonenumber: phonenumber,
		password: hash,
	};

	var sql1 = "Insert into student set ?";
	db.query(sql1, data, (err, rset) => {
		if (err) {
			console.log(err);
			res.render("Student/register", { msg: "error" });
		} else {
			res.render("Student/register", { msg: "success" });
		}
	});
};

const getDashboard = (req, res) => {};

const getHealth = (req, res) => {
	res.render("/health");
};

const postHealth = (req, res) => {
	res.render("/health");
};

const getProfile = (req, res) => {
	res.render("/profile");
};

const postProfile = (req, res) => {
	res.render("/profile:s_id");
};

module.exports = {
	getLogin,
	postLogin,
	getRegister,
	postRegister,
	getDashboard,
	getHealth,
	postHealth,
	getProfile,
	postProfile,
};
