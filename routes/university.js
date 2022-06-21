const express = require("express");
const router = express.Router();
const { universityLogin, addVisitStudent, getStudentVisited } = require("../controllers/university");
const { authenticateUniversity } = require("../middleware/auth")

router.post("/login", universityLogin);

router.post("/scan", authenticateUniversity, addVisitStudent);

router.get("/studentVisited", authenticateUniversity, getStudentVisited)

module.exports = router;
