const {sign} = require("jsonwebtoken");

const createTokensStudent = (user) => {
	const accessToken = sign(
		{ studentnumber: user },
		"88SYdIPcqMyfxONh4X0cV2fsel/3VEwx2SoYM+phvXxTo627iPEIly+rj1PbLh75vxucM54D0q1sx9daBREENlPXBYBxyDh1grwmDklF9KAw7IgLUIPtJoeAw2m8m1eTH2Z+ICUt904lCZ2CL9lNs6DeXBXiLOsDU1Rhf7tCfj32UwlRTIRNRWDrTGphcnucnC7kD/wz75NeHLQg/lePH8GymmwT/LrzS8oef+pQfd6TkJg/GE+rxt2YY93sCWWK2TcJVOFGq3V+voZhak0o1XSsbEA9cH3ImZ2ctiWj06JVqJwYBIjNEGfuqJM0nY6aVjFDfM65G4i83QrOD3aGeQ==",
		{ expiresIn: "45m" }
	);
	return accessToken
};

const createTokensFaculty = (user) => {
	const accessToken = sign(
		{ faculty_id: user },
		"88SYdIPcqMyfxONh4X0cV2fsel/3VEwx2SoYM+phvXxTo627iPEIly+rj1PbLh75vxucM54D0q1sx9daBREENlPXBYBxyDh1grwmDklF9KAw7IgLUIPtJoeAw2m8m1eTH2Z+ICUt904lCZ2CL9lNs6DeXBXiLOsDU1Rhf7tCfj32UwlRTIRNRWDrTGphcnucnC7kD/wz75NeHLQg/lePH8GymmwT/LrzS8oef+pQfd6TkJg/GE+rxt2YY93sCWWK2TcJVOFGq3V+voZhak0o1XSsbEA9cH3ImZ2ctiWj06JVqJwYBIjNEGfuqJM0nY6aVjFDfM65G4i83QrOD3aGeQ==",
		{ expiresIn: "45m" }
	);
	return accessToken
};

const createTokensAdmin = (user) => {
	const accessToken = sign(
		{ username: user },
		"88SYdIPcqMyfxONh4X0cV2fsel/3VEwx2SoYM+phvXxTo627iPEIly+rj1PbLh75vxucM54D0q1sx9daBREENlPXBYBxyDh1grwmDklF9KAw7IgLUIPtJoeAw2m8m1eTH2Z+ICUt904lCZ2CL9lNs6DeXBXiLOsDU1Rhf7tCfj32UwlRTIRNRWDrTGphcnucnC7kD/wz75NeHLQg/lePH8GymmwT/LrzS8oef+pQfd6TkJg/GE+rxt2YY93sCWWK2TcJVOFGq3V+voZhak0o1XSsbEA9cH3ImZ2ctiWj06JVqJwYBIjNEGfuqJM0nY6aVjFDfM65G4i83QrOD3aGeQ==",
		{ expiresIn: "45m" }
	);
	return accessToken
};

module.exports = {createTokensStudent,createTokensFaculty,createTokensAdmin};
