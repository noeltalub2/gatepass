const date_time = () => {
	let today = new Date();
	return today.toLocaleString();
};

const date = () => {
	let today = new Date();
	return today.toLocaleDateString();
};

module.exports = {date_time,date}