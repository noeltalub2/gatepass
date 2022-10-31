const express = require('express');
const router = express.Router();

const studentController = require("../controller/student")

router.get("/login",studentController.getLogin)
router.post("/login",studentController.postLogin)

router.get("/register",studentController.getRegister)
router.post("/register",studentController.postRegister)

router.get("/dashboard",studentController.getDashboard)

router.get("/health",studentController.getHealth)
router.post("/health",studentController.postHealth)

router.get("/profile:student_id",studentController.getProfile)
router.get("/profile",studentController.postProfile)



module.exports = {router}