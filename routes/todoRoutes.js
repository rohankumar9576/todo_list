const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");

router.get("/todos", todoController.getTodos);
router.get("/todos/download",todoController.downloadTodos);
router.get("/todos/filter",todoController.filterTodos);
router.get("/todos/:id", todoController.getTodoById);
router.post("/todos", todoController.addTodo);
router.put("/todos/:id", todoController.updateTodo);
router.delete("/todos/:id", todoController.deleteTodo);
router.post("/todos/upload", todoController.uploadTodos);

module.exports = router;
