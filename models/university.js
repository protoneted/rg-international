const db = require("../config/query");

const getUniversityByUserName = async (userName) => {
	try {
		const result = await db.query(
			` SELECT university.id ,university.university , country.name , university.stole_number , university.password FROM university JOIN country ON country.id = university.country_id WHERE user_name = '${userName}' `
		);
		return result;
	} catch (e) {
		return { err: e };
	}
};

const getStudentById = async (student_id, university_id) => {
	try {
		const result = await db.query(
			` SELECT * FROM student_visited WHERE student_id = '${student_id}' and university_id = '${university_id}'`
		);
		return result[0];
	} catch (e) {
		return { err: e };
	}
};

const studentVisit = async (data) => {
	try {
		const result = await db.query(
			"INSERT INTO `student_visited`( `university_id`, `student_id` ) " +
			"VALUES (?,?)",
			[
				data.universityId,
				data.student_id,
			]
		);
		return result;
	} catch (e) {
		return e;
	}
};

const studentVisited = async (uId) => {
	try {
		const result = await db.query(
			"SELECT COUNT(id) as total_student from `student_visited` WHERE university_id = ? ",
			[uId]
		);
		return result[0];
	} catch (e) {
		return e;
	}
};


module.exports = {
	getUniversityByUserName, getStudentById,
	studentVisit, studentVisited
};
