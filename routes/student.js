const express = require("express");
const router = express.Router();

const studentController = require("../controller/student");

const imageUpload = require("../middleware/imageUpload")
const { forwardAuth, requireAuth } = require("../middleware/studentAuth");

router.get("/login", forwardAuth, studentController.getLogin);
router.post("/login", forwardAuth, studentController.postLogin);

router.get("/register", forwardAuth, studentController.getRegister);
router.post("/register", forwardAuth, studentController.postRegister);

router.get("/dashboard", requireAuth, studentController.getDashboard);

router.get("/health", requireAuth, studentController.getHealth);
router.post("/health", requireAuth, studentController.postHealth);

router.get("/profile", requireAuth, studentController.getProfile);

router.get("/profile/edit_information/:id", requireAuth, studentController.getProfileEditInfo);
router.post("/profile/edit_information", requireAuth, studentController.postProfileEditInfo);

router.get("/profile/edit_avatar/:id", requireAuth, studentController.getProfileEditAvatar);
router.post("/profile/edit_avatar", requireAuth, imageUpload.single("avatar"), studentController.postProfileEditAvatar);

router.get("/logout", requireAuth, studentController.getLogout)

module.exports = router;
