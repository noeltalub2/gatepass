const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const { createTokensFaculty } = require("../utils/token");
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
	res.render("Faculty/login");
};

const postLogin = (req, res) => {
	try {
		const { email, password } = req.body;
		const findUser = "SELECT * from faculty WHERE email = ?";
		db.query(findUser, [email], async (err, result) => {
			if (err) {
				req.flash(
					"error_msg",
					"Authentication failed."
				);
				res.redirect("/faculty/login");
			} else {
				if (result.length > 0) {
					const match_password = await bcrypt.compare(
						password,
						result[0].password
					);
					if (match_password) {
						const generateToken = createTokensFaculty(
							result[0].faculty_id
						);
						res.cookie("token", generateToken, { httpOnly: true });
						res.redirect("/faculty/dashboard");
					} else {
						req.flash(
							"error_msg",
							"Incorrect email or password"
						);
						res.redirect("/faculty/login");
					}
				} else {
					req.flash("error_msg", "Could'nt find your account");
					res.redirect("/faculty/login");
				}
			}
		});
	} catch {
		throw err;
	}
};

const getDashboard = async (req, res) => {
	const gatepass = await zeroParam(
		"SELECT * FROM `gatepass` ORDER BY `gatepass_id` DESC LIMIT 10;"
	);

	const totalRegistered = (
		await zeroParam(
			`SELECT count(*) as 'count' FROM gatepass WHERE submit_date LIKE '%${date()}%'`
		)
	)[0].count;
	const totalApproved = (
		await zeroParam(
			`SELECT count(*) as 'count' FROM gatepass WHERE status = 'Approved' AND submit_date LIKE '%${date()}%'`
		)
	)[0].count;
	const totalPending = (
		await zeroParam(
			`SELECT count(*) as 'count' FROM gatepass WHERE status = 'Pending' AND submit_date LIKE '%${date()}%'`
		)
	)[0].count;
	const totalWarning = (
		await zeroParam(
			`SELECT count(*) as 'count' FROM gatepass WHERE status = 'Reject' AND submit_date LIKE '%${date()}%'`
		)
	)[0].count;

	res.render("Faculty/dashboard", {
		gatepass,
		totalRegistered,
		totalApproved,
		totalPending,
		totalWarning,
	});
};

const getGatepass = async (req, res) => {
	const gatepass = await zeroParam(
		"SELECT * FROM `gatepass` INNER JOIN student ON student.studentnumber = gatepass.studentnumber;"
	);
	res.render("Faculty/gatepass", { gatepass });
};

const getGatepassApproved = async (req, res) => {
	
	const gatepass_ref = req.params.gatepass_ref;
	var sql =
		"UPDATE gatepass SET status=?, modified_date=? WHERE gatepass_ref = ?";
	//Add account to database
	db.query(
		sql,
		["Approved", date_time(), gatepass_ref],
		(err, rset) => {
		
			if (err) {
				req.flash("error_msg", `Failed to Update Gatepass Ref: ${gatepass_ref}`);
				res.redirect("/faculty/gatepass");
			} else {
				
				req.flash("success_msg",`Successfully Approved Gatepass Ref: ${gatepass_ref}`)
				res.redirect("/faculty/gatepass");
			}
		}
	);
};
const getGatepassReject = async (req, res) => {
	const gatepass_ref = req.params.gatepass_ref;
	var sql =
		"UPDATE gatepass SET status=?, modified_date =? WHERE gatepass_ref = ?";
	//Add account to database
	db.query(
		sql,
		["Reject", date_time() , gatepass_ref],
		(err, rset) => {
			if (err) {
				req.flash("error_msg", `Failed to Update Gatepass Ref: ${gatepass_ref}`);
				res.redirect("/faculty/gatepass");
			} else {
				
				req.flash("success_msg",`Successfully Reject Gatepass Ref: ${gatepass_ref}`)
				res.redirect("/faculty/gatepass");
			}
		}
	);
};

const getProfile = async (req, res) => {
	const faculty = (await zeroParam("SELECT * FROM faculty"))[0];
	res.render("Faculty/profile", { faculty });
};


const getUpdateAccount = async (req, res) => {
	const faculty = (await queryParam("SELECT * FROM faculty WHERE faculty_id = ?",[res.locals.sid]))[0];
	res.render("Faculty/update-account",{faculty, status: "",msg: ""})
};

const postUpdateAccount = async (req, res) => {
	const {firstname,lastname,email,phonenumber} = req.body
	var sql = "UPDATE faculty SET firstname=?, lastname=?, email=?, phonenumber=? WHERE faculty_id = ?"

	db.query(
		sql,
		[
			firstname,
			lastname,
			email,
			phonenumber,
			res.locals.sid,
		],
		(err, rset) => {
			if (err) {
				req.flash("error_msg", "Failed to update your account");
				res.redirect("/faculty/profile");
			} else {
				req.flash("success_msg", "Successfully updated your personal information");
				res.redirect("/faculty/profile");
			}
		}
	);
};

const getUpdatePass = async (req, res) => {
	res.render("Faculty/update-password")
};

const postUpdatePass = async (req, res) => {
	const {password} = req.body
	const salt = bcrypt.genSaltSync(15);
	const hash = bcrypt.hashSync(password, salt);
	var sql = "UPDATE faculty SET password=? WHERE faculty_id = ?"
	db.query(
		sql,
		[
			hash,
			res.locals.sid,
		],
		(err, rset) => {
			if (err) {
				req.flash("error_msg", "Failed to update your password");
				res.redirect("/faculty/profile");
			} else {
				req.flash("success_msg", "Successfully updated your password");
				res.redirect("/faculty/profile");
			}
		}
	);
	
};

const getLogout = (req, res) => {
	res.clearCookie("token");
	res.redirect("/faculty/login");
};

module.exports = {
	getLogin,
	postLogin,

	getDashboard,

	getGatepass,
	getGatepassApproved,
	getGatepassReject,

	getProfile,
	
	getUpdateAccount,
	postUpdateAccount,

	getUpdatePass,
	postUpdatePass,
	
	
	getLogout,
};
