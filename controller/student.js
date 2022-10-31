const db = require("mysql2");
const bcrypt = require("bcrypt");

const getLogin = (req, res) => {
	res.render("Student/login", { status_msg: "" });
};

const postLogin = (req, res) => {
	try {
		const { student_number, password } = req.body;
		const findUser = "SELECT * from student WHERE student_number = ?";
		db.query(findUser, [student_number], async (err, result) => {
			if (
				result === 0 ||
				!(await bcrypt.compare(password, result[0].password))
			) {
				res.render("student/login", {
					errors: "Student number or Passsword is Incorrect",
				});
			} else {
				res.redirect("Student/dashboard");
			}
		});
	} catch {
		throw err;
	}
};

const getRegister = (req, res) => {
	res.render("register", { status_msg: "" });
};

const postRegister = async (req, res) => {
	//Data from the form ../register
	const {
		student_number,
		lastname,
		firstname,
		email,
		phonenumber,
		password,
	} = req.body;

	// Catch any error like duplicate
	let error = [];

	var sid_dupli =
		"Select count(*) as `count` from student_acc where student_number = ?";

	//To encrypt the password using hash
	const salt = bcrypt.genSaltSync(15);
	const hash = bcrypt.hashSync(password, salt);

	var data = {
		firstname: firstname,
		lastname: lastname,
		email: email,
		phonenumber: phonenumber,
		student_number: student_number,
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
