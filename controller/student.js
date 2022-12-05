const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const { createTokens } = require("../utils/token");
const { date_time,date } = require("../utils/date");


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

const getRegister = async (req, res) => {
	res.render("Student/register", { status: "", msg: "" });
};

const postRegister = async (req, res) => {
	//Data from the form ../register
	const {
		studentnumber,
		lastname,
		firstname,
		course,
		phonenumber,
		email,
		password,
	} = req.body;

	//Sql statement if there is duplciate in database
	var student_exist =
		"Select count(*) as `count` from student where studentnumber = ?";
	var email_exist =
		"Select count(*) as `count` from student where email = ?";
	//Query statement
	const student_count = (await queryParam(student_exist, [studentnumber]))[0].count;
	const email_count = (await queryParam(email_exist, [email]))[0].count;

	//Check if there is duplicate
	if ((student_count > 0) && (email_count > 0)) {
		res.render("Student/register", {
			status: "error_warning",
			msg: "Student number and Email is already registered",
		});
	} else if (student_count > 0) {
		res.render("Student/register", {
			status: "error_warning",
			msg: "Student number is already registered",
		});
	} else if (email_count > 0) {
		res.render("Student/register", {
			status: "error_warning",
			msg: "Email is already registered",
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
		course: course,
		phonenumber: phonenumber,
		email: email,
		avatar: "default.png",
		password: hash,
		complete_details: 0,
		is_verified: 0,
		join_date: date_time(),
	};
	//Add account to database
	var sql = "INSERT INTO student SET ?";
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

const getDashboard = async (req, res) => {
	var sid = res.locals.sid.toString();
	const course = (await zeroParam("SELECT * FROM course"));
	const student = (
		await queryParam("SELECT * from student WHERE studentnumber = ?", [
			res.locals.sid,
		])
	)[0];
	var gatepass =
		`SELECT *, count(*) as 'count' FROM gatepass WHERE studentnumber = ? AND submit_date LIKE '%${date()}%'`;

	db.query(gatepass, [sid], async (err, data) => {
		if (err) throw err;
		if (data[0].count !== 0) {
			res.render("Student/dashboard", { course,student, gatepass: data });
		} else {
			res.render("Student/dashboard", { course,student, gatepass: "Unavailable" });
		}
	});
};

const getHealth = (req, res) => {
	var sid = res.locals.sid.toString();
	var sql1 =
		`SELECT gatepass_ref,submit_date,count(*) as 'count' FROM gatepass WHERE studentnumber = ? AND submit_date LIKE '%${date()}%'`;
	db.query(sql1, [sid], (err, data) => {
		if (err) throw err;
		if (data[0].count !== 0) {
			res.render("Student/health", { submitted: true, data });
		} else {
			res.render("Student/health", { submitted: false });
		}
	});

};

const postHealth = (req, res) => {
	const ID = nanoid(8);
	const {
		// Symptoms
		fever,
		cough,
		cold,
		no_sense_smell,
		diarrhea,
		sore_throat,
		difficult_breath,
		muscle_joint_pain,
		// Exposure
		travel_history,
		visit_other_place,
		exposure_anyone,
		takecare_people,
		monitor_by_personnel,
	} = req.body;

	var sql = "INSERT INTO gatepass SET ?";
	var hdf = {
		gatepass_ref: ID,
		studentnumber: res.locals.sid,
		submit_date: date_time(),
		status: "Pending",
		fever: fever,
		cough: cough,
		cold: cold,
		no_sense_smell: no_sense_smell,
		diarrhea: diarrhea,
		sore_throat: sore_throat,
		difficult_breath: difficult_breath,
		muscle_joint_pain: muscle_joint_pain,

		travel_history: travel_history,
		visit_other_place: visit_other_place,
		exposure_anyone: exposure_anyone,
		takecare_people: takecare_people,
		monitor_by_personnel: monitor_by_personnel,
	};

	//Add to database
	db.query(sql, hdf, (err, rset) => {
		if (err) throw err;
		res.redirect("/student/health");
	});
};

const getProfile = async (req, res) => {
	const course = (await zeroParam("SELECT * FROM course"));
	const studentData = (
		await queryParam("SELECT * from student WHERE studentnumber = ?", [
			res.locals.sid,
		])
	)[0];
	if (studentData.complete_details) {
		res.render("Student/profile", {
			course,
			student: studentData,
			status:"",
			msg:"",
		});
	} else {
		res.render("Student/profile", {
			course,
			student: studentData,
			status:"error_warning",
			msg:"To verify your account please complete your information details and add your picture.",
		});
	}
	
};

const getProfileEditInfo = async (req, res) => {
	const studentnumber = req.params.id;
	const course = (await zeroParam("SELECT * FROM course"));
	const studentData = (
		await queryParam("SELECT * from student WHERE studentnumber = ?", [
			studentnumber,
		])
	)[0];

	res.render("Student/editprofile", {
		course,
		student: studentData,
	});
};

const postProfileEditInfo = (req, res) => {
	
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
		studentnumber,
		
	} = req.body;
	var sql =
		"UPDATE student SET firstname=?, lastname=?,gender=?,dob=?, course=?, year=?,section=?, address=?, email=?, phonenumber=?, complete_details=1 WHERE studentnumber = ?";
	//Add account to database
	db.query(sql, [
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
		studentnumber], (err, rset) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/student/profile")
		}
	});
};

const getProfileEditAvatar = async (req,res) => {
	const studentnumber = req.params.id;
	const studentData = (
		await queryParam("SELECT studentnumber,avatar from student WHERE studentnumber = ?", [
			studentnumber,
		])
	)[0];
	res.render("Student/editavatar", {
		student: studentData,
	});
}

const postProfileEditAvatar = (req, res) => {
	const {studentnumber} = req.body;
	var avatar = req.file.filename
	var sql = "UPDATE student SET avatar = ? WHERE studentnumber = ?"
	console.log(avatar)
	db.query(sql, [avatar,
		studentnumber], (err, rset) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/student/profile")
		}
	});
};
const getLogout = (req, res) => {
	res.clearCookie("token");
	res.redirect("/student/login");
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
	getProfileEditInfo,
	postProfileEditInfo,
	getProfileEditAvatar,
	postProfileEditAvatar,
	getLogout,
};
