const getLogin = (req, res) => {};
const postLogin = (req, res) => {};

const getRegister = (req, res) => {};
const postRegister = (req, res) => {
	//Data from the form ./register
	const {
		student_number,
		lastname,
		firstname,
		email,
		phonenumber,
		password,
	} = req.body;

	// Catch any error
	let error = [];

	var sql =
		"Select count(*) as `count` from student_acc where student_number = ?";

	//To encrypt the password using hash
	const salt = bcrypt.genSaltSync(15);
	const hash = bcrypt.hashSync(password, salt);


	var data = {
		firstname: firstname,
		lastname: lastname,
		email: email,
		phonenumber: phonenumber,
		student_number: student_number,
		password: hash,
	};

	var sql1 = "Insert into student_acc set ?";
	var query = conn.query(sql1, data, (err, rset) => {
		if (err) {
			console.log(err);
			res.render("register", { msg: "error" });
		} else {
			res.render("register", { msg: "success" });
		}
	});
};

const getDashboard = (req, res) => {};

const getHealth = (req, res) => {
	res.render("/health");
};

const postHealth = (req, res) => {
	res.render("/health");
};

const getProfile = (req, res) => {
	res.render("/profile");
};

const postProfile = (req, res) => {
	res.render("/profile:s_id");
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
	postProfile,
};
