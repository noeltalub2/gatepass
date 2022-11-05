const {sign} = require("jsonwebtoken");

const createTokens = (user) => {
	const accessToken = sign(
		{ studentnumber: user },
		process.env.JWT_SECRET_KEY,
		{ expiresIn: process.env.JWT_EXPIRE }
	);
	return accessToken
};

module.exports = {createTokens};
