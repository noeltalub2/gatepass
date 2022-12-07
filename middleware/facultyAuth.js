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
		return (await db.promise().query("SELECT * FROM faculty WHERE email = ?", [id]))[0];
	} catch (err) {
		throw err;
	}
};
const requireAuth = async (req, res, next) => {
	const token = req.cookies.token;
	if (token) {
		verify(token, process.env.JWT_SECRET_KEY, async (err, rset) => {
			if (err) res.redirect("/unauthorized");
			else {0 === (await queryId(rset.email)).length ?
				res.redirect("/unauthorized") : ((res.locals.sid = rset.email), next());
			}
		});
	} else res.redirect("/unauthorized");
};

const forwardAuth = async (req, res, next) => {
	const token = req.cookies.token;
	if (token) {
		verify(token, process.env.JWT_SECRET_KEY, async (err, rset) => {
			if (err) next();
			else { 0 === (await queryId(rset.email)).length ? 
				next() : ((res.locals.sid = rset.email), res.redirect("/faculty/dashboard"));
			}
		});
	} else next();
};

module.exports = { requireAuth, forwardAuth };
