const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const { createTokensAdmin } = require("../utils/token");
const { date_time, date } = require("../utils/date");
const { path } = require("pdfkit");

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
	res.render("Admin/login", { status: "", msg: "" });
};

const postLogin = (req, res) => {
	try {
		const { username, password } = req.body;
		const findUser = "SELECT * from admin WHERE username = ?";
		db.query(findUser, [username], async (err, result) => {
			if (err) {
				res.render("Admin/login", {
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
						const generateToken = createTokensAdmin(
							result[0].username
						);
						res.cookie("token", generateToken, { httpOnly: true });
						res.redirect("/admin/dashboard");
					} else {
						res.render("Admin/login", {
							status: "error",
							msg: "Incorrect student number or password",
						});
					}
				} else {
					res.render("Admin/login", {
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

const getDashboard = async (req, res) => {
	const recentGatepass = await zeroParam(
		"SELECT * FROM `gatepass` ORDER BY `gatepass_id` DESC LIMIT 5;"
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
	res.render("Admin/dashboard", {
		recentGatepass,
		totalGatepass,
		todayRegistered,
		totalStudent,
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
				console.log(err);
			} else {
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
	res.render("Admin/addfaculty", { msg: "", status: "" });
};

const postFacultyAdd = async (req, res) => {
	const ID = nanoid(8);
	const { firstname, lastname, email, phonenumber, password } = req.body;

	//Sql statement if there is duplciate in database
	var phone_exist =
		"Select count(*) as `count` from faculty where phonenumber = ?";
	var email_exist = "Select count(*) as `count` from faculty where email = ?";
	//Query statement
	const phone_count = (await queryParam(phone_exist, [phonenumber]))[0].count;
	const email_count = (await queryParam(email_exist, [email]))[0].count;

	//Check if there is duplicate
	if (phone_count > 0 && email_count > 0) {
		res.render("Admin/addfaculty", {
			status: "error_warning",
			msg: "Phone number and Email is already registered",
		});
	} else if (phone_count > 0) {
		res.render("Admin/addfaculty", {
			status: "error_warning",
			msg: "Phone number is already registered",
		});
	} else if (email_count > 0) {
		res.render("Admin/addfaculty", {
			status: "error_warning",
			msg: "Email is already registered",
		});
	}

	//To encrypt the password using hash
	const salt = bcrypt.genSaltSync(15);
	const hash = bcrypt.hashSync(password, salt);
	//Data to insert in sql
	var data = {
		faculty_id: ID,
		phonenumber: phonenumber,
		firstname: firstname,
		lastname: lastname,
		email: email,
		avatar: "default.png",
		password: hash,
	};
	//Add account to database
	var sql = "INSERT INTO faculty SET ?";
	db.query(sql, data, (err, rset) => {
		if (err) {
			console.log(err);
			res.render("Admin/addfaculty", {
				status: "error",
				msg: "An error occur while creating your account",
			});
		} else {
			res.render("Admin/addfaculty", {
				status: "success",
				msg: "Faculty account created successfully",
			});
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
				console.log(err);
			} else {
				res.redirect("/admin/faculty");
			}
		}
	);
};

const getReport = async (req, res) => {
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

const getGenerate = async (req, res) => {
	const gatepass = (
		await zeroParam(
			"SELECT count(*) as 'count' FROM gatepass WHERE status = 'Approved'"
		)
	)[0].count;
	const doc = new PDFDocument({ size: "A4", margin: 30 });

	doc.pipe(fs.createWriteStream("./public/pdf/report.pdf")); // write to PDF
	doc.pipe(res); // HTTP response
	doc.font("Helvetica-Bold");
	// add stuff to PDF here using methods described below...
	// finalize the PDF and end the stream
	doc.image("./public/img/mmsu_logo.png", 30, 30, { width: 40 });
	doc.image("./public/img/cit_logo.png", 75, 33, { width: 40 });

	doc.fontSize(18);
	doc.text("CIT Gatepass Management", { align: "center" });
	doc.fontSize(16);
	doc.text("Daily Report", { align: "center" });
	doc.fontSize(10).text(`Date & time generated: ${date_time()}`, {
		align: "center",
	});
	doc.moveDown(2);

	doc.font("Helvetica");
	doc.fontSize(11);

	doc.text(`REGISTERED :`, 50, 180, { align: "left" });
	doc.text(`${gatepass}`, 150, 180, { align: "left" });

	doc.text(`APPROVED :`, 50, 200, { align: "left" });
	doc.text(`${gatepass}`, 150, 200, { align: "left" });

	doc.text(`REJECTED :`, 50, 220, { align: "left" });
	doc.text(`${gatepass}`, 150, 220, { align: "left" });

	doc.end();
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
	getReport,
	getGenerate,
	getLogout,
};
