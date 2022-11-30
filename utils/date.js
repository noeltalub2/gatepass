const today = () => {
	let today = new Date();
	today.setDate(today.getDate());
	return today.toISOString().split("T")[0];
};
const tomorrow = () => {
	let today = new Date();
	today.setDate(today.getDate() + 1);
	return today.toISOString().split("T")[0];
};

module.exports = {today, tomorrow}