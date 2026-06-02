const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");

const {
  getTodosByDate,
  createTodo,
  updateTodo,
  deleteTodo,
  getAllTodos,
} = require("../controllers/todoController");

router.use(verifyToken);

router.get("/:date", getTodosByDate);

router.get("/", getAllTodos);

router.post("/", createTodo);

router.put("/:id", updateTodo);

router.delete("/:id", deleteTodo);

module.exports = router;
