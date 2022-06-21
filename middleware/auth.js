/* eslint-disable semi */
/* eslint-disable quotes */
const jwt = require("jsonwebtoken");
const { getUserById } = require("../models/users");

const authenticateToken = async (req, res, next) => {
	try {
		const bearerHeader = req.headers.authorization;
		if (bearerHeader) {
			const bearer = bearerHeader.split(" ");
			const bearerToken = bearer[1];
			const decoded = jwt.verify(bearerToken, process.env.AUTH_TOKEN);
			req.user = decoded;
			// res.send(decoded);
			next();
		} else {
			// Forbidden
			res.sendStatus(403);
		}
	} catch (error) {
		return res.send({ msg: error.message, status: 400 });
	}
};


const authenticateUniversity = (req, res, next) => {
	try {
		const bearerHeader = req.headers.authorization;

		if (bearerHeader) {
			const bearer = bearerHeader.split(" ");
			const bearerToken = bearer[1];
			const decoded = jwt.verify(bearerToken, process.env.AUTH_TOKEN);
			req.user = decoded;
			if (decoded.userType == "university") {
				next();
			} else {
				res.send({ status: 403, msg: "only university admin can access this page." });
			}
		} else {
			// Forbidden
			res.sendStatus(403);
		}
	} catch (error) {
		return res.send({ msg: error.message, status: 400 });
	}
};

const authenticateAdmin = (req, res, next) => {
	try {
		const bearerHeader = req.headers.authorization;

		if (bearerHeader) {
			const bearer = bearerHeader.split(" ");
			const bearerToken = bearer[1];
			const decoded = jwt.verify(bearerToken, process.env.AUTH_TOKEN);
			req.user = decoded;
			if (decoded.userType == "admin") {
				next();
			} else {
				res.send({ status: 403, msg: "only admin can access this page." });
			}
		} else {
			// Forbidden
			res.sendStatus(403);
		}
	} catch (error) {
		return res.send({ msg: error.message, status: 400 });
	}
};

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (!token) return res.status(401).send("no token");
//   jwt.verify(token, process.env.AUTH_TOKEN, (err, user) => {
//     if (err) return res.status(403).send("expired token");
//     req.user = user;
//     next();
//   });
// };

module.exports = {
	authenticateToken,
	authenticateAdmin,
	authenticateUniversity,
};
