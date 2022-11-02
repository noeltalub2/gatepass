const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "gatepass",
});

const queryParam = async (sql, data) => {
	try {
		const result = await db.promise().query(sql,[data]);
		return result[0]
	} catch (err) {
		console.log("Error => " + err)
		return err
	} 
};

const zeroParam = async (sql) => {
	try {
		const result = await db.promise().query(sql,[data]);
		return result[0]
	} catch (err) {
		console.log("Error => " + err)
		return err
	} 
};

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
	const { studentnumber, lastname, firstname, email, phonenumber, password } =
		req.body;
	//Sql statement if there is duplciate in database
	var email_exist = "Select count(*) as `count` from student where email = ?";
	var phone_exist =
		"Select count(*) as `count` from student where phonenumber = ?";

	//Query statement
	const email_count = await queryParam(email_exist, [email]);
	const phone_count = await queryParam(phone_exist, [phonenumber]);
	console.log(email_count)
	console.log(phone_count)
	//Check if there is duplicate
	if (email_count || phone_count) {
		res.render("student/register", {
			msg: "Email or Phone Number are already exist",
		});
	} else {
		//To encrypt the password using hash
		const salt = bcrypt.genSaltSync(15);
		const hash = bcrypt.hashSync(password, salt);
		//Data to insert in sql
		var data = {
			student_number: studentnumber,
			firstname: firstname,
			lastname: lastname,
			email: email,
			phonenumber: phonenumber,
			password: hash,
		};
		//Add account to database
		var sql1 = "Insert into student set ?";
		db.query(sql1, data, (err, rset) => {
			if (err) {
				console.log(err);
				res.render("Student/register", {
					msg: "Error creating your account",
				});
			} else {
				res.render("student/login", {
					msg: "Account created successfully",
				});
			}
		});
	}
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
