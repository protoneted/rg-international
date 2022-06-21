const { getUniversityByUserName, getStudentById, studentVisit, studentVisited } = require("../models/university");
const jwt = require("jsonwebtoken")
const universityLogin = async (req, res) => {
	try {
		const data = {
			username: req.body.username,
			password: req.body.password,
		};
		const universityList = await getUniversityByUserName(data.username);
		if (!(universityList.length == 0)) {
			if (universityList[0].password == data.password) {
				const universityId = universityList[0].id
				const universityName = universityList[0].university;
				const universityCountry = universityList[0].name;
				const universityStoleNo = universityList[0].stole_number;
				const universityListfinal = {
					universityId,
					universityName,
					universityCountry,
					universityStoleNo,
				};
				const tokenObj = {
					userType: "university",
					universityId: universityId,

				};

				const token = jwt.sign(tokenObj, process.env.AUTH_TOKEN, {
					expiresIn: "7d",
				});
				res.send({
					status: 200,
					msg: "Logged in successfully!",
					data: universityListfinal,
					token
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
				msg: "University doesn't exist!",
				data: [],
			});
		}
	} catch (e) {
		res.send({ msg: e.message, status: 500 });
	}
};

const addVisitStudent = async (req, res) => {
	try {
		const { student_id } = req.body;
		const { universityId } = req.user
		const data = {
			universityId,
			student_id
		};

		const studentExist = await getStudentById(student_id, universityId);
		if (studentExist) {
			return res.send({
				msg: "Student already exist!",
				data: [],
				status: 400,
			});
		}

		const result = await studentVisit(data);

		res.send({
			msg: "Student added successfully!",
			result,
			status: 200,
		});
	} catch (e) {
		res.send({ msg: e.message, status: 400 });
	}
};

const getStudentVisited = async (req, res) => {
	const { universityId } = req.user

	const result = await studentVisited(universityId);

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


module.exports = { universityLogin, addVisitStudent, getStudentVisited };
