const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");


const { createTokensAdmin } = require("../utils/token");
const { date_time, date } = require("../utils/date");


const db = require("../db/db")

const queryParam = async (sql, data) => {
	try {
		return (await db.promise().query(sql, [data]))[0];
	} catch (err) {
		throw err;
	}
};

const zeroParam = async (sql) => {
	try {
		return (await db.promise().query(sql))[0];
	} catch (err) {
		throw err;
	}
};

const getLogin = (req, res) => {
	res.render("Admin/login");
};

const postLogin = (req, res) => {
	try {
		const { username, password } = req.body;
		const findUser = "SELECT * from admin WHERE username = ?";
		db.query(findUser, [username], async (err, result) => {
			if (err) {
				req.flash(
					"error_msg",
					"Authentication failed."
				);
				res.redirect("/admin/login");
			} else {
				if (result.length > 0) {
					const match_password = await bcrypt.compare(
						password,
						result[0].password
					);
					if (match_password) {
						const generateToken = createTokensAdmin(
							result[0].username
						);
						res.cookie("token", generateToken, { httpOnly: true });
						res.redirect("/admin/dashboard");
					} else {
						req.flash(
							"error_msg",
							"Incorrect username or password"
						);
						res.redirect("/admin/login");
					}
				} else {
					req.flash("error_msg", "Could'nt find your account");
					res.redirect("/admin/login");
				}
			}
		});
	} catch {
		throw err;
	}
};

const getDashboard = async (req, res) => {
	const recentGatepass = await zeroParam(
		"SELECT * FROM `gatepass` ORDER BY `gatepass_id` DESC LIMIT 6;"
	);
	const totalGatepass = (
		await zeroParam("SELECT count(*) as 'count' FROM gatepass")
	)[0].count;

	const todayRegistered = (
		await zeroParam(
			`SELECT count(*) as 'count' FROM gatepass WHERE submit_date LIKE '%${date()}%'`
		)
	)[0].count;

	const todayApproved = (
		await zeroParam(
			`SELECT count(*) as 'count' FROM gatepass WHERE status = 'Approved' AND submit_date LIKE '%${date()}%'`
		)
	)[0].count;
	const todayPending = (
		await zeroParam(
			`SELECT count(*) as 'count' FROM gatepass WHERE status = 'Pending' AND submit_date LIKE '%${date()}%'`
		)
	)[0].count;
	const todayReject = (
		await zeroParam(
			`SELECT count(*) as 'count' FROM gatepass WHERE status = 'Reject' AND submit_date LIKE '%${date()}%'`
		)
	)[0].count;

	const totalStudent = (
		await zeroParam("SELECT count(*) as 'count' FROM student")
	)[0].count;

	const totalFaculty = (
		await zeroParam("SELECT count(*) as 'count' FROM faculty")
	)[0].count;
	res.render("Admin/dashboard", {
		recentGatepass,
		totalGatepass,
		todayRegistered,
		totalStudent,
		totalFaculty,
		todayApproved,
		todayPending,
		todayReject,
	});
};

const getStudent = async (req, res) => {
	const students = await zeroParam("SELECT * FROM student");
	res.render("Admin/student", { students });
};

const getStudentEdit = async (req, res) => {
	const studentnumber = req.params.id;
	const course = await zeroParam("SELECT * FROM course");
	const studentData = (
		await queryParam("SELECT * from student WHERE studentnumber = ?", [
			studentnumber,
		])
	)[0];

	res.render("Admin/editstudent", {
		course,
		student: studentData,
	});
};

const postStudentEdit = (req, res) => {
	const {
		firstname,
		lastname,
		gender,
		dob,
		course,
		year,
		section,
		address,
		email,
		phonenumber,
		is_verified,
		studentnumber,
	} = req.body;
	var sql =
		"UPDATE student SET firstname=?, lastname=?,gender=?,dob=?, course=?, year=?,section=?, address=?, email=?, phonenumber=?, is_verified=? WHERE studentnumber = ?";
	//Add account to database
	db.query(
		sql,
		[
			firstname,
			lastname,
			gender,
			dob,
			course,
			year,
			section,
			address,
			email,
			phonenumber,
			is_verified,
			studentnumber,
		],
		(err, rset) => {
			if (err) {
				req.flash("error_msg", "Failed to update student account");
				res.redirect("/admin/student");
			} else {
				req.flash("success_msg", "Successfully updated student information");
				res.redirect("/admin/student");
			}
		}
	);
};

const getFaculty = async (req, res) => {
	const faculty = await zeroParam("SELECT * FROM faculty");
	res.render("Admin/faculty", { faculty });
};

const getFacultyAdd = async (req, res) => {
	res.render("Admin/addfaculty");
};

const postFacultyAdd = async (req, res) => {

	const { firstname, lastname, email, phonenumber, password } = req.body;
	let errors = []
	//Sql statement if there is duplciate in database
	var phone_exist =
		"Select count(*) as `count` from faculty where phonenumber = ?";
	var email_exist = "Select count(*) as `count` from faculty where email = ?";
	//Query statement
	const phone_count = (await queryParam(phone_exist, [phonenumber]))[0].count;
	const email_count = (await queryParam(email_exist, [email]))[0].count;
	
	if (email_count > 0) {
		errors.push({ msg: "Email is already registered" });
	}
	if (phone_count > 0) {
		errors.push({ msg: "Phonenumber is already registered" });
	}
	
	//To encrypt the password using hash
	const salt = bcrypt.genSaltSync(15);
	const hash = bcrypt.hashSync(password, salt);
	//Data to insert in sql
	var data = {
		firstname: firstname,
		lastname: lastname,
		email: email,
		avatar: "default.png",
		phonenumber: phonenumber,
		password: hash,
	};
	//Add account to database
	var sql = "INSERT INTO faculty SET ?";

	db.query(sql, data, (err, rset) => {
		if (err) {
			res.render("Admin/addfaculty",{errors});
		} else {
			req.flash("success_msg", "Account created successfully");
			res.redirect("/admin/faculty");
		}
	});
};

const getFacultyEdit = async (req, res) => {
	const faculty_id = req.params.id;

	const facultyData = (
		await queryParam("SELECT * from faculty WHERE faculty_id = ?", [
			faculty_id,
		])
	)[0];

	res.render("Admin/editfaculty", {
		faculty: facultyData,
	});
};

const postFacultyEdit = (req, res) => {
	const { firstname, lastname, email, phonenumber, faculty_id } = req.body;
	var sql =
		"UPDATE faculty SET firstname=?, lastname=?, email=?, phonenumber=? WHERE faculty_id = ?";
	//Add account to database
	db.query(
		sql,
		[firstname, lastname, email, phonenumber, faculty_id],
		(err, rset) => {
			if (err) {
				req.flash("error_msg", "Failed to update student account");
				res.redirect("/admin/faculty");
			} else {
				
				req.flash("success_msg","Successfully updated faculty information")
				res.redirect("/admin/faculty");
			}
		}
	);
};

const getReportData = async (req, res) => {
	const students = (await zeroParam("SELECT * from student"));
	const gatepass = (await zeroParam("SELECT * from gatepass"));
	const totalApproved = (
		await zeroParam(
			"SELECT count(*) as 'count' FROM gatepass WHERE status = 'Approved'"
		)
	)[0].count;

	const totalReject = (
		await zeroParam(
			"SELECT count(*) as 'count' FROM gatepass WHERE status = 'Reject'"
		)
	)[0].count;

	const registeredBAT = (
		await zeroParam(
			"SELECT count(*) as 'count' FROM student WHERE course = 'BAT'"
		)
	)[0].count;
	const registeredCADT = (
		await zeroParam(
			"SELECT count(*) as 'count' FROM student WHERE course = 'CADT'"
		)
	)[0].count;
	const registeredCMPT = (
		await zeroParam(
			"SELECT count(*) as 'count' FROM student WHERE course = 'CMPT'"
		)
	)[0].count;
	const registeredELTR = (
		await zeroParam(
			"SELECT count(*) as 'count' FROM student WHERE course = 'ELTR'"
		)
	)[0].count;
	const registeredEXTR = (
		await zeroParam(
			"SELECT count(*) as 'count' FROM student WHERE course = 'EXTR'"
		)
	)[0].count;
	const registeredFPSM = (
		await zeroParam(
			"SELECT count(*) as 'count' FROM student WHERE course = 'FPSM'"
		)
	)[0].count;
	const registeredGT = (
		await zeroParam(
			"SELECT count(*) as 'count' FROM student WHERE course = 'GT'"
		)
	)[0].count;

	res.render("Admin/report", {
		students,
		gatepass,
		totalApproved,
		totalReject,
		registeredBAT,
		registeredCADT,
		registeredCMPT,
		registeredELTR,
		registeredEXTR,
		registeredFPSM,
		registeredGT,
	});
};

const getLogout = (req, res) => {
	res.clearCookie("token");
	res.redirect("/admin/login");
};
module.exports = {
	getLogin,
	postLogin,
	getDashboard,
	getStudent,
	getStudentEdit,
	postStudentEdit,
	getFaculty,
	getFacultyAdd,
	postFacultyAdd,
	getFacultyEdit,
	postFacultyEdit,
	getReportData,

	getLogout,
};
