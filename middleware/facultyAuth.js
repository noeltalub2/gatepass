const { verify } = require("jsonwebtoken");
const db = require("../db/db")

const queryId = async (id) => {
	try {
		return (await db.promise().query("SELECT * FROM faculty WHERE faculty_id = ?", [id]))[0];
	} catch (err) {
		throw err;
	}
};
const requireAuth = async (req, res, next) => {
	const token = req.cookies.token;
	if (token) {
		verify(token, process.env.JWT_SECRET_KEY, async (err, rset) => {
			if (err) res.redirect("/unauthorized");
			else {0 === (await queryId(rset.faculty_id)).length ?
				res.redirect("/unauthorized") : ((res.locals.sid = rset.faculty_id), next());
			}
		});
	} else res.redirect("/unauthorized");
};

const forwardAuth = async (req, res, next) => {
	const token = req.cookies.token;
	if (token) {
		verify(token, process.env.JWT_SECRET_KEY, async (err, rset) => {
			if (err) next();
			else { 0 === (await queryId(rset.faculty_id)).length ? 
				next() : ((res.locals.sid = rset.faculty_id), res.redirect("/faculty/dashboard"));
			}
		});
	} else next();
};

module.exports = { requireAuth, forwardAuth };
