const jwt = require("jsonwebtoken");

const createTokens = (user) => {
	const accessToken = jwt.sign(
		{ studentnumber: user[0].studentnumber },
		process.env.SECRET_KEY,
		{ expiresIn: process.env.JWT_EXPIRE }
	);
	return accessToken
};

module.exports = {createTokens};
