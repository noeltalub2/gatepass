const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const { createTokensFaculty } = require("../utils/token");
const { date_time, date } = require("../utils/date");

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
	res.render("Faculty/login", { status: "", msg: "" });
};

const postLogin = (req, res) => {
	try {
		const { email, password } = req.body;
		const findUser = "SELECT * from faculty WHERE email = ?";
		db.query(findUser, [email], async (err, result) => {
			if (err) {
				res.render("Faculty/login", {
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
						const generateToken = createTokensFaculty(
							result[0].email
						);
						res.cookie("token", generateToken, { httpOnly: true });
						res.redirect("/faculty/dashboard");
					} else {
						res.render("Faculty/login", {
							status: "error",
							msg: "Incorrect student number or password",
						});
					}
				} else {
					res.render("Faculty/login", {
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
	const gatepass = await queryParam(
		"UPDATE gatepass SET status='Approved' WHERE gatepass_ref=?",
		[gatepass_ref]
	);
	res.redirect("/faculty/gatepass");
};
const getGatepassReject = async (req, res) => {
	const gatepass_ref = req.params.gatepass_ref;
	const gatepass = await queryParam(
		"UPDATE gatepass SET status='Reject' WHERE gatepass_ref=?",
		[gatepass_ref]
	);
	res.redirect("/faculty/gatepass");
};

const getProfile = (req, res) => {
	res.render("Faculty/profile");
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
	getProfile,
	getGatepassApproved,
	getGatepassReject,
	getLogout
};
