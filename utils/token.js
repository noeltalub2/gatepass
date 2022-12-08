const {sign} = require("jsonwebtoken");

const createTokensStudent = (user) => {
	const accessToken = sign(
		{ studentnumber: user },
		process.env.JWT_SECRET_KEY,
		{ expiresIn: process.env.JWT_EXPIRE }
	);
	return accessToken
};

const createTokensFaculty = (user) => {
	const accessToken = sign(
		{ faculty_id: user },
		process.env.JWT_SECRET_KEY,
		{ expiresIn: process.env.JWT_EXPIRE }
	);
	return accessToken
};

const createTokensAdmin = (user) => {
	const accessToken = sign(
		{ username: user },
		process.env.JWT_SECRET_KEY,
		{ expiresIn: process.env.JWT_EXPIRE }
	);
	return accessToken
};

module.exports = {createTokensStudent,createTokensFaculty,createTokensAdmin};
