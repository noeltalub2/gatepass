const express = require("express");
const router = express.Router();

const adminController = require("../controller/admin");

const { forwardAuth, requireAuth } = require("../middleware/adminAuth");

router.get("/login", forwardAuth, adminController.getLogin);
router.post("/login", forwardAuth, adminController.postLogin);

router.get("/dashboard", requireAuth, adminController.getDashboard);

router.get("/student", requireAuth, adminController.getStudent);
router.get("/student/edit=:id", requireAuth, adminController.getStudentEdit);
router.post("/student/edit", requireAuth, adminController.postStudentEdit);

router.get("/faculty", requireAuth, adminController.getFaculty);

router.get("/faculty/add", requireAuth, adminController.getFacultyAdd);
router.post("/faculty/add", requireAuth, adminController.postFacultyAdd);

router.get("/faculty/edit=:id", requireAuth, adminController.getFacultyEdit);
router.post("/faculty/edit", requireAuth, adminController.postFacultyEdit);

router.get("/reportdata", requireAuth, adminController.getReportData);

router.get("/logout", requireAuth, adminController.getLogout)

module.exports = router;
