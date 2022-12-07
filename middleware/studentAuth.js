const { verify } = require("jsonwebtoken");
const mysql = require("mysql2");
const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "gatepass",
});

const queryId = async (id) => {
	try {
		return (await db.promise().query("SELECT * FROM student WHERE studentnumber = ?", [id]))[0];
	} catch (err) {
		throw err;
	}
};
const requireAuth = async (req, res, next) => {
	const token = req.cookies.token;
	if (token) {
		verify(token, process.env.JWT_SECRET_KEY, async (err, rset) => {
			if (err) res.redirect("/unauthorized");
			else {0 === (await queryId(rset.studentnumber)).length ?
				res.redirect("/unauthorized") : ((res.locals.sid = rset.studentnumber), next());
			}
		});
	} else res.redirect("/unauthorized");
};

const forwardAuth = async (req, res, next) => {
	const token = req.cookies.token;
	if (token) {
		verify(token, process.env.JWT_SECRET_KEY, async (err, rset) => {
			if (err) next();
			else { 0 === (await queryId(rset.studentnumber)).length ? 
				next() : ((res.locals.sid = rset.studentnumber), res.redirect("/student/dashboard"));
			}
		});
	} else next();
};

module.exports = { requireAuth, forwardAuth };
