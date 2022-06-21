const express = require("express");
const router = express.Router();
const users = require("./users");

const admin = require("./admin");

const university = require("./university");

router.use("/users", users);

router.use("/admin", admin);

router.use("/university", university);

module.exports = router;
