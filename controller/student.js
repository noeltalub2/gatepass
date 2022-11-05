const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const { createTokens } = require("../utils/token");

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "gatepass",
});

const queryParam = async (sql, data) => {
	try {
		return (await db.promise().query(sql, [data]))[0];
	} catch (err) {
		throw (console.log("Error => " + err), err);
	}
};

const zeroParam = async (sql) => {
	try {
		return (await db.promise().query(sql))[0];
	} catch (err) {
		throw (console.log("Error => " + err), err);
	}
};

const getLogin = (req, res) => {
	res.render("Student/login", { status: "", msg: "" });
};

const postLogin = (req, res) => {
	try {
		const { studentnumber, password } = req.body;
		const findUser = "SELECT * from student WHERE studentnumber = ?";
		db.query(findUser, [studentnumber], async (err, result) => {
			if (err) {
				res.render("Student/login", {
					status: "error",
					msg: "Authentication Failed",
				});
			} else {
				if (result.length > 0) {
					const match_password = await bcrypt.compare(
						password,
						result[0].password
					);
					if (match_password) {
						const generateToken = createTokens(
							result[0].studentnumber
						);
						res.cookie("token", generateToken, { httpOnly: true });
						res.redirect("/student/dashboard");
					} else {
						res.render("Student/login", {
							status: "error",
							msg: "Incorrect student number or password",
						});
					}
				} else {
					res.render("Student/login", {
						status: "error",
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
	res.render("Student/register", { status: "", msg: "" });
};

const postRegister = async (req, res) => {
	//Data from the form ../register
	const { studentnumber, lastname, firstname, email, phonenumber, password } =
		req.body;

	//Sql statement if there is duplciate in database
	var phone_exist =
		"Select count(*) as `count` from student where phonenumber = ?";

	//Query statement
	const phone_count = (await queryParam(phone_exist, [phonenumber]))[0].count;
	console.log(phone_count);

	//Check if there is duplicate
	if (phone_count) {
		return res.render("Student/register", {
			status: "error_warning",
			msg: "Phone number already registered",
		});
	}
	//To encrypt the password using hash
	const salt = bcrypt.genSaltSync(15);
	const hash = bcrypt.hashSync(password, salt);
	//Data to insert in sql
	var data = {
		studentnumber: studentnumber,
		firstname: firstname,
		lastname: lastname,
		email: email,
		phonenumber: phonenumber,
		password: hash,
	};
	//Add account to database
	var sql = "Insert into student set ?";
	db.query(sql, data, (err, rset) => {
		if (err) {
			console.log(err);
			res.render("Student/register", {
				status: "error",
				msg: "An error occur while creating your account",
			});
		} else {
			res.render("Student/register", {
				status: "success",
				msg: "Account created successfully",
			});
		}
	});
};

const getDashboard = (req, res) => {
	res.render("Student/dashboard");
};

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
