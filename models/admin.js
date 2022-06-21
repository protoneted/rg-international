const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/query");

//adduser----------------------------------------------------------------------------------------------------
// const addUserApi = async (data) => {
//   try {
//     const {
//       first_name,
//       last_name,
//       username,
//       phone_number,
//       email,
//       located_profile,
//       employed_at,
//     } = data;
//     if (password !== confirm_password) {
//       return { valErr: "password mismatched" };
//     }

//     const salt = bcrypt.genSaltSync(10);
//     const hashedPwd = bcrypt.hashSync(password, salt);

//     const userCheck = await db.query(
//       "SELECT * FROM users WHERE first_name = ? AND last_name = ? AND username = ?",
//       [first_name, last_name, username]
//     );

//     if (userCheck.length === 0) {
//       const d = new Date();
//       const createDate =
//         d.getFullYear() +
//         "-" +
//         (d.getMonth() + 1) +
//         "-" +
//         d.getDate() +
//         " " +
//         d.getHours() +
//         ":" +
//         d.getMinutes() +
//         ":" +
//         d.getSeconds();

//       const result = await db.query(
//         "INSERT INTO users (`first_name`, `last_name`, `username`, `phone_number`, `email`, `located_profile`, `employed_at`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,?,?,?,?)",
//         [
//           first_name,
//           last_name,
//           username,
//           phone_number,
//           email,
//           located_profile,
//           employed_at,
//           createDate,
//           createDate,
//         ]
//       );
//       return result;
//     } else {
//       return { valErr: "Data already exits." };
//     }
//   } catch (error) {
//     console.log(error);
//     return { err: error };
//   }
// };

// const updateUserApi = async (data, id) => {
//   try {
//     const {
//       first_name,
//       last_name,
//       job_title,
//       profession,
//       service_line,
//       phone_number,
//       email,
//       employed_at,
//       street,
//       city,
//       state,
//       country,
//     } = data;

//     const d = new Date();
//     const updateDate =
//       d.getFullYear() +
//       "-" +
//       (d.getMonth() + 1) +
//       "-" +
//       d.getDate() +
//       " " +
//       d.getHours() +
//       ":" +
//       d.getMinutes() +
//       ":" +
//       d.getSeconds();

//     const companyId = await db.query(
//       "SELECT id FROM companies WHERE name = ?",
//       [employed_at]
//     );

//     const result = await db.query(
//       `UPDATE users SET first_name=?, last_name=?, job_title=?, profession=?, service_line=?, phone_number=?, email=?, employed_at=?, street=?, city=?, state=?, country=?, updated_at=? WHERE id= ${id}`,
//       [
//         first_name,
//         last_name,
//         job_title,
//         profession,
//         service_line,
//         phone_number,
//         email,
//         companyId[0].id,
//         street,
//         city,
//         state,
//         country,
//         updateDate,
//       ]
//     );
//     return result;
//   } catch (error) {
//     return { err: error };
//   }
// };

const totalCount = async (id) => {
	try {
		let totalCountry = await db.query(
			" SELECT COUNT(id) as 'country' FROM `country`"
		);
		let totalCourses = await db.query(
			" SELECT COUNT(id) as 'courses' FROM `courses`"
		);
		let totalDomain = await db.query(
			" SELECT COUNT(id) as 'domain' FROM `domain`"
		);
		let totalPrograms = await db.query(
			" SELECT COUNT(id) as 'programs' FROM `programs`"
		);
		let totalStudents = await db.query(
			" SELECT COUNT(id) as 'student' FROM `student`"
		);
		let totalUniversity = await db.query(
			" SELECT COUNT(id) as 'university' FROM `university`"
		);

		totalCountry = totalCountry[0].country;
		totalCourses = totalCourses[0].courses;
		totalDomain = totalDomain[0].domain;
		totalPrograms = totalPrograms[0].programs;
		totalStudents = totalStudents[0].student;
		totalUniversity = totalUniversity[0].university;
		return {
			totalCountry,
			totalCourses,
			totalDomain,
			totalPrograms,
			totalStudents,
			totalUniversity,
		};
	} catch (error) {
		return { err: error };
	}
};

const AllStudents = async (data) => {
	try {
		let offset = (data.page - 1) * data.size;
		let defaultOrder = " ORDER BY created_at ASC ";
		let limitQuery = " limit " + data.size + " OFFSET " + offset;
		let whereQuery = " WHERE status = 'active' ";

		if (data.keyword) {
			whereQuery +=
				' AND  first_name LIKE  "%' +
				data.keyword +
				'%" OR last_name LIKE  "%' +
				data.keyword +
				'%" OR city LIKE  "%' +
				data.keyword +
				'%"';
		}
		const result = await db.query(
			"SELECT  id, `first_name`, `last_name`, `gender`, `ph_no`, `city`, `email` FROM `student` " +
				whereQuery +
				defaultOrder +
				limitQuery
		);
		const totalItems = result.length;
		const totalData = await db.query(
			"SELECT id FROM student WHERE status = 'active' "
		);

		const totalPages = Math.floor(totalData.length / data.size);
		const currentPage = Number(data.page);

		return { result, totalItems, totalPages, currentPage };
	} catch (error) {
		return { err: error };
	}
};

const AllCountry = async (data) => {
	try {
		let offset = (data.page - 1) * data.size;
		let defaultOrder = " ORDER BY created_at ASC ";
		let limitQuery = " limit " + data.size + " OFFSET " + offset;
		let whereQuery = " WHERE status = 'active' ";

		if (data.keyword) {
			whereQuery += ' AND  name LIKE  "%' + data.keyword + '%"';
		}
		const result = await db.query(
			"SELECT  id ,name FROM `country` " +
				whereQuery +
				defaultOrder +
				limitQuery
		);
		const totalItems = result.length;
		const totalData = await db.query(
			"SELECT id FROM country WHERE status = 'active' "
		);

		const totalPages = Math.floor(totalData.length / data.size);
		const currentPage = Number(data.page);

		return { result, totalItems, totalPages, currentPage };
	} catch (error) {
		return { err: error };
	}
};

const AllPrograms = async (data) => {
	try {
		let offset = (data.page - 1) * data.size;
		let defaultOrder = " ORDER BY created_at ASC ";
		let limitQuery = " limit " + data.size + " OFFSET " + offset;
		let whereQuery = " WHERE status = 'active' ";

		if (data.keyword) {
			whereQuery += ' AND  program_name LIKE  "%' + data.keyword + '%"';
		}
		const result = await db.query(
			"SELECT  id ,program_name FROM `programs` " +
				whereQuery +
				defaultOrder +
				limitQuery
		);
		const totalItems = result.length;
		const totalData = await db.query(
			"SELECT id FROM programs WHERE status = 'active' "
		);

		const totalPages = Math.floor(totalData.length / data.size);
		const currentPage = Number(data.page);

		return { result, totalItems, totalPages, currentPage };
	} catch (error) {
		return { err: error };
	}
};

const AllDomain = async (data) => {
	try {
		let offset = (data.page - 1) * data.size;
		let defaultOrder = " ORDER BY created_at ASC ";
		let limitQuery = " limit " + data.size + " OFFSET " + offset;
		let whereQuery = " WHERE status = 'active' ";

		if (data.keyword) {
			whereQuery += ' AND  domain LIKE  "%' + data.keyword + '%"';
		}
		const result = await db.query(
			"SELECT  id ,domain FROM `domain` " +
				whereQuery +
				defaultOrder +
				limitQuery
		);
		const totalItems = result.length;
		const totalData = await db.query(
			"SELECT id FROM domain WHERE status = 'active' "
		);

		const totalPages = Math.floor(totalData.length / data.size);
		const currentPage = Number(data.page);

		return { result, totalItems, totalPages, currentPage };
	} catch (error) {
		return { err: error };
	}
};

const AllCourse = async (data) => {
	try {
		let offset = (data.page - 1) * data.size;
		let defaultOrder = " ORDER BY created_at ASC ";
		let limitQuery = " limit " + data.size + " OFFSET " + offset;
		let whereQuery = " WHERE status = 'active' ";

		if (data.keyword) {
			whereQuery += ' AND  name LIKE  "%' + data.keyword + '%"';
		}
		const result = await db.query(
			"SELECT  id ,name FROM `courses` " +
				whereQuery +
				defaultOrder +
				limitQuery
		);
		const totalItems = result.length;
		const totalData = await db.query(
			"SELECT id FROM courses WHERE status = 'active' "
		);

		const totalPages = Math.floor(totalData.length / data.size);
		const currentPage = Number(data.page);

		return { result, totalItems, totalPages, currentPage };
	} catch (error) {
		return { err: error };
	}
};

const AllUniversity = async (data) => {
	try {
		let offset = (data.page - 1) * data.size;
		let defaultOrder = " ORDER BY university.created_at ASC ";
		let limitQuery = " limit " + data.size + " OFFSET " + offset;
		let whereQuery = " WHERE university.status = 'active' ";

		if (data.keyword) {
			whereQuery += ' AND  university LIKE  "%' + data.keyword + '%"';
		}
		const result = await db.query(
			"SELECT university.id ,university.university,university.stole_number,country.name FROM university JOIN country ON university.country_id = country.id " +
				whereQuery +
				defaultOrder +
				limitQuery
		);
		const totalItems = result.length;
		const totalData = await db.query(
			"SELECT id FROM university WHERE status = 'active' "
		);

		const totalPages = Math.floor(totalData.length / data.size);
		const currentPage = Number(data.page);

		return { result, totalItems, totalPages, currentPage };
	} catch (error) {
		return { err: error };
	}
};
module.exports = {
	totalCount,
	AllStudents,
	AllCountry,
	AllPrograms,
	AllDomain,
	AllCourse,
	AllUniversity,
};
