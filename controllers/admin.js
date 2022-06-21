const { send } = require("express/lib/response");
const res = require("express/lib/response");
const {
	totalCount,
	AllStudents,
	AllCountry,
	AllPrograms,
	AllDomain,
	AllCourse,
	AllUniversity,
} = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//user---------------------------
const adduser = async (req, res) => {
	const deal = await addUserApi(req.body);
	if (!deal.err && !deal.valErr) {
		res.send({
			msg: "User added successfully!",
			data: deal,
			status: 200,
		});
	} else if (deal.valErr) {
		res.send({
			msg: `User ${deal.valErr}!`,
			data: [],
			status: 401,
		});
	} else {
		res.send({
			msg: deal.err,
			data: [],
			status: 400,
		});
	}
};

const getTotalCount = async (req, res) => {
	const deal = await totalCount(req.body, req.params.id);
	if (!deal.err) {
		res.send({
			msg: "total counted successfully!",
			data: deal,
			status: 200,
		});
	} else {
		res.send({
			msg: deal.err,
			data: [],
			status: 400,
		});
	}
};

const adminLogin = async (req, res) => {
	try {
		const data = {
			username: req.body.username,
			password: req.body.password,
		};
		if (data.username === "superadmin@rg.admin") {
			const cmp = await bcrypt.compare(
				req.body.password,
				"$2b$10$i3i1TX5vi90TrN2k2MqHfeCgpq40Dgk5569iGyg8W0ebEwgf8AZZy"
			);
			const tokenObj = {
				userType: "admin",
			};

			const token = jwt.sign(tokenObj, process.env.AUTH_TOKEN, {
				expiresIn: "24h",
			});
			if (cmp) {
				res.send({
					status: 200,
					msg: "Admin Logged in successfully!",
					token,
				});
			} else {
				res.send({
					status: 400,
					msg: "Login failed! Please try again!",
					data: [],
				});
			}
		} else {
			res.send({
				status: 401,
				msg: "Invalid Input!",
				data: [],
			});
		}
	} catch (e) {
		res.send({ msg: e.message, status: 500 });
	}
};

const getTotalStudent = async (req, res) => {
	const deal = await StudentsList(req.query);
	if (!deal.err) {
		res.send({
			msg: "Total Students fetched successfully!",
			data: deal,
			status: 200,
		});
	} else {
		res.send({
			msg: deal.err,
			data: [],
			status: 400,
		});
	}
};

const getAllStudent = async (req, res) => {
	const result = await AllStudents(req.query);
	if (!result.err) {
		res.send({
			msg: "Students fetched successfully!",
			data: result,
			status: 200,
		});
	} else {
		res.send({
			msg: result.err,
			data: [],
			status: 400,
		});
	}
};

const getAllCountry = async (req, res) => {
	const result = await AllCountry(req.query);
	if (!result.err) {
		res.send({
			msg: "Country fetched successfully!",
			data: result,
			status: 200,
		});
	} else {
		res.send({
			msg: result.err,
			data: [],
			status: 400,
		});
	}
};

const getAllPrograms = async (req, res) => {
	const result = await AllPrograms(req.query);
	if (!result.err) {
		res.send({
			msg: "Programs fetched successfully!",
			data: result,
			status: 200,
		});
	} else {
		res.send({
			msg: result.err,
			data: [],
			status: 400,
		});
	}
};

const getAllDomain = async (req, res) => {
	const result = await AllDomain(req.query);
	if (!result.err) {
		res.send({
			msg: "Domain fetched successfully!",
			data: result,
			status: 200,
		});
	} else {
		res.send({
			msg: result.err,
			data: [],
			status: 400,
		});
	}
};

const getAllCourse = async (req, res) => {
	const result = await AllCourse(req.query);
	if (!result.err) {
		res.send({
			msg: "Courses fetched successfully!",
			data: result,
			status: 200,
		});
	} else {
		res.send({
			msg: result.err,
			data: [],
			status: 400,
		});
	}
};

const getAllUniversity = async (req, res) => {
	const result = await AllUniversity(req.query);
	if (!result.err) {
		res.send({
			msg: "Courses fetched successfully!",
			data: result,
			status: 200,
		});
	} else {
		res.send({
			msg: result.err,
			data: [],
			status: 400,
		});
	}
};
module.exports = {
	getAllStudent,
	getTotalCount,
	adminLogin,

	getAllCountry,

	getAllPrograms,

	getAllDomain,

	getAllCourse,

	getAllUniversity,
};
