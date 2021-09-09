const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
	name: String,
	email: {
		type: String,
		required: true,
		unique: true,
		validate: (value) => validator.isEmail(value),
	},
	password: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("user", userSchema);
