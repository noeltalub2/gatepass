const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const { createTokens } = require("../utils/token");
const { today, tomorrow } = require("../utils/date");
const e = require("express");

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

const getRegister = (req, res) => {
	res.render("Student/register", { status: "", msg: "" });
};

const postRegister = async (req, res) => {
	//Data from the form ../register
	const {
		studentnumber,
		lastname,
		firstname,
		degree,
		email,
		phonenumber,
		
		password,
	} = req.body;

	//Sql statement if there is duplciate in database
	var phone_exist =
		"Select count(*) as `count` from student where phonenumber = ?";

	//Query statement
	const phone_count = (await queryParam(phone_exist, [phonenumber]))[0].count;

	//Check if there is duplicate
	if (phone_count) {
		res.render("Student/register", {
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
		degree: degree,
		email: email,
		phonenumber: phonenumber,
		avatar: "default.png",
		password: hash,
		join_date: today(),
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

const getDashboard = async (req, res) => {
	var sid = res.locals.sid;

	const user = (
		await queryParam("SELECT * from student WHERE studentnumber = ?", [
			res.locals.sid,
		])
	)[0];
	var gatepass =
		"SELECT *, count(*) as 'count' FROM gatepass WHERE studentnumber = ? AND submit_date = ?";

	db.query(gatepass, [sid.toString(), today()], async (err, data) => {
		if (err) throw err;
		if (data[0].count !== 0) {
			res.render("Student/dashboard", { user, gatepass: data });
		} else {
			res.render("Student/dashboard", { user, gatepass: "Unavailable" });
		}
	});
};

const getHealth = (req, res) => {
	var sid = res.locals.sid;
	var sql1 =
		"SELECT gatepass_id,submit_date,count(*) as 'count' FROM gatepass WHERE studentnumber = ? AND submit_date = ?";

	db.query(sql1, [sid.toString(), today()], (err, data) => {
		if (err) throw err;
		if (data[0].count !== 0) {
			res.render("Student/health", { submitted: true, data });
		} else {
			res.render("Student/health", { submitted: false });
		}
	});
};

const postHealth = async (req, res) => {
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

	var sql = "Insert into gatepass set ?";
	var hdf = {
		gatepass_id: ID,
		studentnumber: res.locals.sid,
		submit_date: today(),
		effective_date: tomorrow(),
		status: 1,
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
	const studentData = (
		await queryParam("SELECT * from student WHERE studentnumber = ?", [
			res.locals.sid,
		])
	)[0];

	res.render("Student/profile", {
		student: studentData,
		status:"",
		msg:"",
	});
};

const getProfileEditInfo = async (req, res) => {
	const studentnumber = req.params.id;
	const studentData = (
		await queryParam("SELECT * from student WHERE studentnumber = ?", [
			studentnumber,
		])
	)[0];
	res.render("Student/editprofile", {
		student: studentData,
	});
};

const postProfileEditInfo = async (req, res) => {
	const {
		firstname,
		lastname,
		gender,
		dob,
		degree,
		year,
		section,
		address,
		email,
		phonenumber,
		studentnumber,
	} = req.body;
	var sql =
		"UPDATE student SET firstname=?, lastname=?,gender=?,dob=?, degree=?, year=?,section=?, address=?, email=?, phonenumber=? WHERE studentnumber = ?";
	//Add account to database
	db.query(sql, [
		firstname,
		lastname,
		gender,
		dob,
		degree,
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

const postProfileEditAvatar = async (req, res) => {
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
