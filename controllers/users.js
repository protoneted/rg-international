const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
	usersSignUp,
	getUserByEmail,
	getCountriesList,
	getProgramsList,
	getDomainsList,
	getCoursesList,
	getUniversityList,
	addCountryId,
	addProgramId,
	addYear,
	addDomainId,
	addUniversityId,

} = require("../models/users");

const userLogin = async (req, res) => {
	try {
		const data = {
			email: req.body.email,
			password: req.body.password,
		};
		const usersList = await getUserByEmail(data.email);
		if (usersList) {
			const cmp = await bcrypt.compare(req.body.password, usersList.password);
			delete usersList.password;

			const tokenObj = {
				userId: usersList.id,
				email: usersList.email,
			};

			const token = jwt.sign(tokenObj, process.env.AUTH_TOKEN, {
				expiresIn: "24h",
			});
			// const updateToken = await updateUserToken(token, tokenObj.userId);
			const usersListfinal = await getUserByEmail(data.email);
			if (cmp) {
				res.send({
					status: 200,
					msg: "Logged in successfully!",
					data: usersListfinal,
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
				msg: "User doesnt exist!",
				data: [],
			});
		}
	} catch (e) {
		res.send({ msg: e.message, status: 500 });
	}
};

const userSignUp = async (req, res) => {
	try {
		const {
			first_name,
			last_name,
			gender,
			phone_number,
			city,
			email,
			password,
			confirm_password,
		} = req.body;

		if (password !== confirm_password) {
			return res.send({
				msg: "Password & confirm password mismatched!",
				data: [],
			});
		}

		const salt = bcrypt.genSaltSync(10);
		const hashedPwd = bcrypt.hashSync(password, salt);

		const data = {
			first_name,
			last_name,
			gender,
			city,
			phone_number,
			email,
			password: hashedPwd,
		};

		const userExist = await getUserByEmail(email);

		if (userExist) {
			return res.send({
				msg: "User already exist!",
				data: [],
				status: 400,
			});
		}

		const user = await usersSignUp(data);

		data.userId = user.insertId
		const tokenObj = {
			userId: user.insertId,
			email: email,
		};
		const token = jwt.sign(tokenObj, process.env.AUTH_TOKEN, {
			expiresIn: "24h",
		});

		res.send({
			msg: "User added successfully!",
			data,
			status: 200,
			token
		});
	} catch (e) {
		res.send({ msg: e.message, status: 400 });
	}
};

const getCountries = async (req, res) => {
	const result = await getCountriesList(req);
	if (!result.err) {
		res.send({
			msg: "countries fetchded successfully!",
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

const getPrograms = async (req, res) => {
	const result = await getProgramsList(req.user);
	if (!result.err) {
		res.send({
			msg: "Programs fetchded successfully!",
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

const getDomains = async (req, res) => {
	const result = await getDomainsList(req.user);
	if (!result.err) {
		res.send({
			msg: "Domains fetchded successfully!",
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

const getCourses = async (req, res) => {
	const result = await getCoursesList(req.body, req.user);
	if (!result.err) {
		res.send({
			msg: "Courses fetchded successfully!",
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

const getUniversity = async (req, res) => {
	const result = await getUniversityList(req.user);
	if (!result.err) {
		res.send({
			msg: "University fetchded successfully!",
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

const addUsersCountry = async (req, res) => {
	const result = await addCountryId(req.body, req.user);
	if (!result.err) {
		res.send({
			msg: "Country added successfully!",
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

const addUsersProgram = async (req, res) => {
	const result = await addProgramId(req.body, req.user);
	if (!result.err) {
		res.send({
			msg: "Program added successfully!",
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

const addJoiningYear = async (req, res) => {
	const result = await addYear(req.body, req.user);
	if (!result.err) {
		res.send({
			msg: "year added successfully!",
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

const addUsersDomain = async (req, res) => {
	const result = await addDomainId(req.body, req.user);
	if (!result.err) {
		res.send({
			msg: "domain added successfully!",
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

const addUsersUniversity = async (req, res) => {
	const result = await addUniversityId(req.body, req.user);
	if (!result.err) {
		res.send({
			msg: "University added successfully!",
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
};
