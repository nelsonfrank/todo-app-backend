const mongoose = require("mongoose");

const todosSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: String,
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model("Todos", todosSchema);
