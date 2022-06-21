const express = require("express");
const cors = require("cors");

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
		type: "application/x-www-form-urlencoded",
	})
);

app.use(cors());

const router = require("./routes/index");

app.use("/api", router);

app.get("/app", (req, res) => {
	res.send("rg-enquiry - Version - 3");
});

app.listen(3001, () =>
	console.log("Server running on port 3001! - Version - 1 ")
);
