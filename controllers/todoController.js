const TodoItem = require("../models/todoItem");
const multer = require("multer");
const fs = require("fs");
const csvParser = require("csv-parser");
const todoItem = require("../models/todoItem");
const { default: mongoose } = require("mongoose");
const { Parser } = require("json2csv");

// Fetch all todo items.
exports.getTodos = async (req, res) => {
  try {
    const todos = await TodoItem.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// Fetch a single todo item by ID.
exports.getTodoById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    const todo = await TodoItem.findById(req.params.id);
    if (!todo)
      return res
        .status(404)
        .json({ success: false, message: `Todo not found` });
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

// Add a new todo item.
exports.addTodo = async (req, res) => {
  try {
    const newTodo = new TodoItem({
      description: req.body.description,
      status: req.body.status,
    });
    const todo = await newTodo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// Update an existing todo item.
exports.updateTodo = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }
    const todo = await TodoItem.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    todo.description = req.body.description || todo.description;
    todo.status = req.body.status || todo.status;
    await todo.save();
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

// Delete a todo item.
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await TodoItem.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    await TodoItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

//Upload todo items from a CSV file.
const upload = multer({ dest: "upload/" });

exports.uploadTodos = [
  upload.single("file"),
  (req, res) => {
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          await TodoItem.insertMany(results);
          res.status(200).json({ msg: "csv file uploaded and data saved" });
        } catch (error) {
          res.status(500).send("Server error");
        }
      });
  },
];

// Filter todo list items based on status.
exports.filterTodos = async (req, res) => {
  try {
    const status = req.query.status;
    console.log("asmkdsdn", req.query.status);
    const todos = await TodoItem.find({ status: status });
    if (todos.length == 0)
      return res.status(404).json({ message: "todos not found" });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).send("Server Error1");
  }
};

// Download the todo list in CSV format.
exports.downloadTodos = async (req, res) => {
  try {
    const todos = await TodoItem.find();
    const fields = ["_id", "description", "status"];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(todos);
    res.header("content-Type", "text/csv");
    res.attachment("todos.csv");
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};
