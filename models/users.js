const db = require("../config/query");

const getUserByEmail = async (email) => {
	try {
		const result = await db.query(
			` SELECT * FROM student WHERE email = '${email}' `
		);
		return result[0];
	} catch (e) {
		return { err: e };
	}
};

const usersSignUp = async (data) => {
	try {
		const result = await db.query(
			"INSERT INTO `student`( `first_name`, `last_name`, `gender`, `ph_no`, `city`, `email`, `password` ) " +
			"VALUES (?,?,?, ?, ?, ?,?)",
			[
				data.first_name,
				data.last_name,
				data.gender,
				data.phone_number,
				data.city,
				data.email,
				data.password,
			]
		);
		return result;
	} catch (e) {
		return e;
	}
};

const getUserById = async (id) => {
	try {
		const result = await db.query("SELECT * FROM `users` WHERE id = ?", [id]);
		return result;
	} catch (e) {
		return e;
	}
};

const getCountriesList = async () => {
	try {
		const result = await db.query("SELECT id,name FROM `country` ");
		return result;
	} catch (e) {
		return { err: e };
	}
};

const getDomainsList = async (user) => {
	try {
		const { userId } = user;
		let countryQuery = "";
		let programQuery = "";


		const getAllDetails = await db.query(
			"SELECT  selected_country_id, selected_programs_id  " +
			"  FROM student  WHERE student.id = ? ",
			[userId]
		);

		const {

			selected_country_id,
			selected_programs_id,
			joining_year,
		} = getAllDetails[0];

		if (!selected_country_id.split(",").length == 0) {
			selected_country_id.split(",").map((country) => {
				!countryQuery
					? (countryQuery += ` where  ( country.id = ${country} `)
					: (countryQuery += ` or country.id = ${country}  `);
			});
			countryQuery += " ) ";
		}

		if (!selected_programs_id.split(",").length == 0) {
			selected_programs_id.split(",").map((program) => {
				!programQuery
					? (programQuery += ` and ( university_details.program_id = ${program} `)
					: (programQuery += ` or university_details.program_id = ${program}  `);
			});
			programQuery += " ) ";
		}


		const result = await db.query("SELECT domain.id,domain.domain  FROM domain join university_details on university_details.domain_id = domain.id join university on university.id = university_details.university_id join country on country.id = university.country_id " + countryQuery + programQuery +
			" group by domain.domain ");
		return result;
	} catch (e) {
		return { err: e };
	}
};

const getProgramsList = async (user) => {
	try {
		let countryQuery = "";

		const { userId } = user;

		const getUsersCountry = await db.query(
			"SELECT id, selected_country_id FROM student  WHERE student.id = ? ",
			[userId]
		);

		const { selected_country_id } = getUsersCountry[0];

		if (!selected_country_id.split(",").length == 0) {
			selected_country_id.split(",").map((country) => {
				!countryQuery
					? (countryQuery += ` where  ( country.id = ${country} `)
					: (countryQuery += ` or country.id = ${country}  `);
			});
			countryQuery += " ) ";
		}

		const result = await db.query("SELECT programs.id,programs.program_name ,country.id as country_id FROM programs join university_details on university_details.program_id = programs.id join university on university.id = university_details.university_id join country on country.id = university.country_id " + countryQuery + " group by programs.program_name ");
		;
		return result;
	} catch (e) {
		return { err: e };
	}
};

const getCoursesList = async (id, user) => {
	let programQuery = "";
	let countryQuery = "";

	const { userId } = user;

	const getUsersCountry = await db.query(
		"SELECT id, selected_country_id FROM student  WHERE student.id = ? ",
		[userId]
	);

	const { selected_country_id } = getUsersCountry[0];

	if (!selected_country_id.split(",").length == 0) {
		selected_country_id.split(",").map((country) => {
			!countryQuery
				? (countryQuery += ` where  ( country.id = ${country} `)
				: (countryQuery += ` or country.id = ${country}  `);
		});
		countryQuery += " ) ";
	}
	id.program.map((i) => {
		!programQuery
			? (programQuery += ` and ( university_details.program_id= ${i} `)
			: (programQuery += ` or university_details.program_id = ${i} `);
	});
	programQuery += " ) ";
	try {

		const result = await db.query(" SELECT courses.id, courses.name  FROM courses join university_details on university_details.course_id = courses.id join university on university.id = university_details.university_id join country on country.id = university.country_id "
			+ countryQuery + programQuery + " group by courses.name "
		);
		return result;
	} catch (e) {
		return { err: e };
	}
};

const getUniversityList = async (user) => {
	const { userId } = user;
	let countryQuery = "";
	let programQuery = "";
	let domainQuery = "";
	try {

		const getAllDetails = await db.query(
			"SELECT id, first_name, last_name, gender, ph_no, city, email, " +
			" selected_country_id, selected_programs_id, selected_domain_id, joining_year " +
			"  FROM student  WHERE student.id = ? ",
			[userId]
		);

		const {
			id,
			first_name,
			last_name,
			selected_country_id,
			selected_programs_id,
			selected_domain_id,

		} = getAllDetails[0];
		const studentData = {
			id,
			first_name,
			last_name,
		}
		if (!selected_country_id.split(",").length == 0) {
			selected_country_id.split(",").map((country) => {
				!countryQuery
					? (countryQuery += ` where  ( university.country_id = ${country} `)
					: (countryQuery += ` or university.country_id = ${country}  `);
			});
			countryQuery += " ) ";
		}

		if (!selected_programs_id.split(",").length == 0) {
			selected_programs_id.split(",").map((program) => {
				!programQuery
					? (programQuery += ` and ( university_details.program_id = ${program} `)
					: (programQuery += ` or university_details.program_id = ${program}  `);
			});
			programQuery += " ) ";
		}

		if (!selected_domain_id.split(",").length == 0) {
			selected_domain_id.split(",").map((domain) => {
				!domainQuery
					? (domainQuery += `  and ( university_details.domain_id = ${domain} `)
					: (domainQuery += ` or university_details.domain_id = ${domain}  `);
			});
			domainQuery += " ) ";
		}



		const universityData = await db.query(
			"SELECT university.id ,university.university, university.country_id , country.name as 'country' , university.stole_number ,student_visited.status FROM " +
			" (((`university_details` left  JOIN university ON university.id = university_details.university_id) " +
			` JOIN country ON country.id = university.country_id) left join student_visited on student_visited.university_id = university.id and student_visited.student_id = ${userId}) ` +
			countryQuery +
			programQuery +
			domainQuery +
			" GROUP BY university.university "
		);
		// student_visited.student_id = ${ userId }
		return {
			studentData, universityData
		};
	} catch (e) {
		return { err: e };
	}
};

const addCountryId = async (data, user) => {
	const { userId } = user;
	try {
		const result = await db.query(
			" UPDATE `student` SET `selected_country_id`= ?  WHERE id =? ",
			[data.country_id.toString(), userId]
		);
		return result;
	} catch (e) {
		return { err: e };
	}
};

const addProgramId = async (data, user) => {
	const { userId } = user;
	try {
		const result = await db.query(
			" UPDATE `student` SET `selected_programs_id`= ?  WHERE id =? ",
			[data.program_id.toString(), userId]
		);
		return result;
	} catch (e) {
		return { err: e };
	}
};

const addYear = async (data, user) => {
	const { userId } = user;
	try {
		const result = await db.query(
			" UPDATE `student` SET `joining_year`= ? WHERE id =? ",
			[data.year.toString(), userId]
		);
		return result;
	} catch (e) {
		return { err: e };
	}
};

const addDomainId = async (data, user) => {
	const { userId } = user;
	try {
		const result = await db.query(
			" UPDATE `student` SET `selected_domain_id`= ? WHERE id =? ",
			[data.domain_id.toString(), userId]
		);
		return result;
	} catch (e) {
		return { err: e };
	}
};

const addUniversityId = async (data, user) => {
	const { userId } = user;
	try {
		const result = await db.query(
			" UPDATE `student` SET `selected_university_id`= ? WHERE id =? ",
			[data.university_id.toString(), userId]
		);
		return result;
	} catch (e) {
		return { err: e };
	}
};


module.exports = {
	usersSignUp,
	getUserByEmail,
	getUserById,
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

};
