const express = require("express");
const TodoModel = require("../model/todos.model");

const router = express.Router();

router.get("/todos", (req, res) => {
	TodoModel.find().then((doc) => {
		res.send(doc);
	});
});

router.post("/todos", (req, res) => {
	if (!req.body) {
		return res.status(400).send("Request Body Not Found");
	}

	let todo = new TodoModel(req.body);

	todo
		.save()
		.then((doc) => {
			res.status(201).send(doc);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

router.get("/todos/:id", (req, res) => {
	if (!req.params) {
		return res.status(400).send("Request Params Not Found");
	}

	TodoModel.findOne({ _id: req.params.id })
		.then((doc) => {
			if (!doc || doc.length === 0) {
				return res.status(400).send("Todo item not found");
			}

			res.status(200).send(doc);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

router.patch("/todos", (req, res) => {
	if (!req.query) {
		return res.status(500).send("Todo id not found");
	}

	if (!req.body) {
		return res.status(500).send("Payload not provided");
	}

	TodoModel.findOneAndUpdate({ _id: req.query.id }, req.body, {
		new: true,
	})
		.then((doc) => {
			res.status(201).send(doc);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

router.delete("/todo:id", (req, res) => {
	if (!req.query) {
		return res.status(500).send("Todo id not found");
	}

	TodoModel.findOneAndDelete(
		{ _id: req.query.id },
		{
			new: true,
		}
	)
		.then((doc) => {
			res.status(201).send(doc);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

module.exports = router;
