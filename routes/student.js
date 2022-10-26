const express = require('express');
const router = express.Router();

const studentController = require("../controller/student")

router.get("/",studentController.getLogin)

module.exports = router