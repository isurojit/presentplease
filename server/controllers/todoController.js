const Todo = require("../models/Todo");

// Get todos for a date
exports.getTodosByDate = async (req, res) => {
  try {
    const { uid } = req.user;
    const { date } = req.params;

    const todos = await Todo.find({
      uid,
      date,
    }).sort({ createdAt: -1 });

    res.json(todos);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Create Todo
exports.createTodo = async (req, res) => {
  try {
    const { uid } = req.user;

    const { date, title, description } = req.body;

    const todo = await Todo.create({
      uid,
      date,
      title,
      description,
    });

    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Update Todo
exports.updateTodo = async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;

    const todo = await Todo.findOneAndUpdate(
      {
        _id: id,
        uid,
      },
      req.body,
      {
        new: true,
      },
    );

    res.json(todo);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete Todo
exports.deleteTodo = async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;

    await Todo.findOneAndDelete({
      _id: id,
      uid,
    });

    res.json({
      message: "Todo deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getAllTodos = async (req, res) => {
  try {
    const { uid } = req.user;

    const todos = await Todo.find({ uid }).sort({
      createdAt: -1,
    });

    res.json(todos);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
