const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const todosSchema = require("./routes/todos.route");
const bodyParser = require("body-parser");

const todoAppScript = async () => {
	const app = express();

	// third-party middleware
	app.use(bodyParser.json());

	app.use("/api/v1/", todosSchema);

	// 404 Error Handler
	app.use((req, res, next) => {
		res.status(400).send("Page not found");
	});

	// 500 Error Handler
	app.use((err, req, res, next) => {
		console.error(err.stack);
	});

	try {
		// Connect to the MongoDB cluster
		await mongoose.connect(
			process.env.DATABASE_URL,
			{ useNewUrlParser: true, useUnifiedTopology: true },
			() => console.log("Database is connected")
		);
	} catch (e) {
		console.log("could not connect");
	}

	const PORT = process.env.PORT || 3000;

	app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
};

todoAppScript();
