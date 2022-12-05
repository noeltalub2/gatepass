const express = require("express");
const router = express.Router();

const facultyController = require("../controller/faculty");


const { forwardAuth, requireAuth } = require("../middleware/auth");

router.get("/login", forwardAuth, facultyController.getLogin);
router.post("/login", forwardAuth, facultyController.postLogin);

router.get("/dashboard", facultyController.getDashboard);

router.get("/gatepass", facultyController.getGatepass);

router.get("/gatepass/approved=:gatepass_ref", facultyController.getGatepassApproved);
router.get("/gatepass/reject=:gatepass_ref", facultyController.getGatepassReject);

router.get("/profile", facultyController.getProfile);

module.exports = router