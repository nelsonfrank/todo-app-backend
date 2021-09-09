const router = require("express").Router();
const UserModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
// const auth = require('../middleware/Authorization');
const bcrypt = require("bcrypt");
const { registerValidation, loginValidation } = require("../validation/auth");

router.post("/register", async (req, res) => {
	// validate user payload
	const { error } = registerValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// check if email exist
	const emailExist = await UserModel.findOne({ email: req.body.email });
	if (emailExist) return res.status(400).send("Email already exist");

	// Encrypting password
	const salt = await bcrypt.genSalt();
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	const user = new UserModel({ ...req.body, password: hashedPassword });
	user
		.save()
		.then(() => {
			res.status(201).json({
				userId: user._id,
				status: "success",
				message: "user created successfully",
			});
		})
		.catch((error) => {
			res.status(500).json(error);
		});
});

router.post("/login", async (req, res) => {
	// validate user payload
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// check if user exists
	const user = await UserModel.findOne({ email: req.body.email });
	if (!user) return res.status(400).send("Email or Password is wrong!");

	UserModel.find({ email: req.body.email })
		.then(async (doc) => {
			if (await bcrypt.compare(req.body.password, doc[0].password)) {
				const token = jwt.sign(req.body, process.env.TOKEN_SECRET, {
					expiresIn: "1800s",
				});

				res
					.header("Authentication", token)
					.status(200)
					.json({ status: "Login successfully" });
			} else {
				res.status(400).send("Fail to login in");
			}
		})
		.catch((error) => {
			res.status(500).json(error);
		});
});

module.exports = router;
