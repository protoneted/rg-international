const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
	userLogin,
	userSignUp,
	getCountries,
	getPrograms,
	getDomains,
	getCourses,
	getUniversity,
	addUsersCountry,
	addUsersProgram,
	addJoiningYear,
	addUsersDomain,
	addUsersUniversity,

} = require("../controllers/users");

router.post("/signup", userSignUp);

router.post("/login", userLogin);

router.get("/country", getCountries);

router.get("/program", authenticateToken, getPrograms);

// router.post("/courses", authenticateToken, getCourses);

router.get("/domain", authenticateToken, getDomains);

router.get("/university", authenticateToken, getUniversity);

router.post("/country", authenticateToken, addUsersCountry);

router.post("/program", authenticateToken, addUsersProgram);

router.post("/year", authenticateToken, addJoiningYear);

router.post("/domain", authenticateToken, addUsersDomain);

router.post("/university", authenticateToken, addUsersUniversity);


module.exports = router;
