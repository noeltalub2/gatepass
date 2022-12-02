const multer = require("multer");
const path = require('path');

const imageStorage = multer.diskStorage({
	// Destination to store image
	destination: "public/img/avatar/",
	filename: (req, file, cb) => {
		cb(
			null,Date.now() + path.extname(file.originalname)
		);

		// path.extname get the uploaded file extension
	},
});
const imageUpload = multer({
	storage: imageStorage,
	limits: {
		fileSize: 5000000, // 5000000 Bytes = 5 MB
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
			// upload only png, jpg, and jpeg format
			return cb(new Error("Please upload a Image. Try again"));
		}
		cb(undefined, true);
	},
});

module.exports = imageUpload;
