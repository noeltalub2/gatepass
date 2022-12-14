const express = require("express");
const router = express.Router();

const facultyController = require("../controller/faculty");


const { forwardAuth, requireAuth, } = require("../middleware/facultyAuth");

router.get("/login", forwardAuth, facultyController.getLogin);
router.post("/login", forwardAuth, facultyController.postLogin);

router.get("/dashboard", requireAuth,facultyController.getDashboard);

router.get("/gatepass", requireAuth,facultyController.getGatepass);

router.get("/gatepass/approved=:gatepass_ref", requireAuth,facultyController.getGatepassApproved);
router.get("/gatepass/reject=:gatepass_ref",requireAuth, facultyController.getGatepassReject);

router.get("/profile", requireAuth,facultyController.getProfile);

router.get("/profile/update-account", requireAuth, facultyController.getUpdateAccount);
router.post("/profile/update-account", requireAuth, facultyController.postUpdateAccount);

router.get("/profile/update-password", requireAuth, facultyController.getUpdatePass);
router.post("/profile/update-password", requireAuth, facultyController.postUpdatePass);


router.get("/logout", requireAuth, facultyController.getLogout)

module.exports = router