import React, { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function TodoModal({ selectedDate, onClose }) {
  const [todos, setTodos] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const [editingId, setEditingId] = useState(null);

  const loadTodos = async () => {
    try {
      const { data } = await api.get(`/todos/${selectedDate}`);

      setTodos(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      loadTodos();
    }
  }, [selectedDate]);

  const addOrUpdateTodo = async () => {
    if (!form.title.trim()) return;

    try {
      if (editingId) {
        await api.put(`/todos/${editingId}`, form);

        toast.success("Task Updated");
      } else {
        await api.post("/todos", {
          date: selectedDate,
          ...form,
        });

        toast.success("Task Added");
      }

      setForm({
        title: "",
        description: "",
        priority: "medium",
      });

      setEditingId(null);

      loadTodos();
    } catch (err) {
      toast.error("Failed");
    }
  };

  const editTodo = (todo) => {
    setEditingId(todo._id);

    setForm({
      title: todo.title,
      description: todo.description || "",
      priority: todo.priority || "medium",
    });
  };

  const toggleComplete = async (todo) => {
    await api.put(`/todos/${todo._id}`, {
      completed: !todo.completed,
    });

    loadTodos();
  };

  const deleteTodo = async (id) => {
    await api.delete(`/todos/${id}`);

    toast.success("Deleted");

    loadTodos();
  };

  const completed = todos.filter((t) => t.completed).length;

  const progress = todos.length
    ? Math.round((completed / todos.length) * 100)
    : 0;

  return (
    <div className="todo-modal-overlay">
      <div className="todo-modal modern">
        <div className="todo-header">
          <h2>Tasks</h2>

          <span>{selectedDate}</span>
        </div>

        <div className="todo-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <small>
            {completed}/{todos.length} Completed
          </small>
        </div>

        <div className="todo-add">
          <input
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            placeholder="Task title"
          />

          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            placeholder="Description"
          />

          <select
            value={form.priority}
            onChange={(e) =>
              setForm({
                ...form,
                priority: e.target.value,
              })
            }
          >
            <option value="low">🟢 Low</option>

            <option value="medium">🟡 Medium</option>

            <option value="high">🔴 High</option>
          </select>

          <button className="btn-primary" onClick={addOrUpdateTodo}>
            {editingId ? "Update Task" : "Add Task"}
          </button>
        </div>

        <div className="todo-list">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className={`todo-card ${todo.completed ? "completed" : ""}`}
            >
              <div>
                <h4>{todo.title}</h4>

                <p>{todo.description}</p>

                <span className={`priority ${todo.priority}`}>
                  {todo.priority}
                </span>
              </div>

              <div className="todo-actions">
                <button onClick={() => toggleComplete(todo)}>
                  {todo.completed ? "↩" : "✓"}
                </button>

                <button onClick={() => editTodo(todo)}>✏️</button>

                <button onClick={() => deleteTodo(todo._id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>

        <button className="btn-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
