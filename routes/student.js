const express = require("express");
const router = express.Router();

const studentController = require("../controller/student");
const { forwardAuth, requireAuth } = require("../middleware/auth");

router.get("/login", forwardAuth, studentController.getLogin);
router.post("/login", forwardAuth, studentController.postLogin);

router.get("/register", forwardAuth, studentController.getRegister);
router.post("/register", forwardAuth, studentController.postRegister);

router.get("/dashboard", requireAuth, studentController.getDashboard);

router.get("/health", requireAuth, studentController.getHealth);
router.post("/health", requireAuth, studentController.postHealth);

router.get("/profile:student_id", requireAuth, studentController.getProfile);
router.get("/profile", requireAuth, studentController.postProfile);

router.get("/logout",requireAuth,studentController.getLogout)

module.exports = router;
