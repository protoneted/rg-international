const express = require("express");
const router = express.Router();
const { authenticateAdmin } = require("../middleware/auth");
const {
	getAllStudent,
	getTotalCount,
	adminLogin,
	getAllCountry,
	getAllPrograms,
	getAllDomain,
	getAllCourse,
	getAllUniversity,
} = require("../controllers/admin");

router.post("/adminLogin", adminLogin);

router.get("/totalCount", authenticateAdmin, getTotalCount);

router.get("/allStudent", getAllStudent);

router.get("/allcountry", getAllCountry);

router.get("/allprogram", getAllPrograms);

router.get("/alldomain", getAllDomain);

router.get("/allcourse", getAllCourse);

router.get("/alluniversity", getAllUniversity);

module.exports = router;
