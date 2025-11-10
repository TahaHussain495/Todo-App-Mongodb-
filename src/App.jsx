import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // For editing
  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState("");

  const API_URL = "http://localhost:3000/api/todos";

  // Fetch all todos from backend
  const fetchTodos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add new todo
  const handleAddTodo = async () => {
    if (input.trim() === "") return;
    console.log(input);
    
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo: input }),
      });
      const newTodo = await res.json();
      setTodos([...todos, newTodo]);
      setInput("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  // Delete a todo
  const handleDeleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTodos(todos.filter((todo) => todo._id !== id));
      if (editingId === id) {
        setEditingId(null);
        setEditInput("");
      }
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  // Toggle completion
  const handleToggleComplete = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const res = await fetch(`${API_URL}/${id}/toggle`, { method: "PATCH" });
      const updatedTodo = await res.json();
      setTodos(todos.map((t) => (t._id === id ? updatedTodo : t)));
    } catch (err) {
      console.error("Error toggling todo:", err);
    }
  };

  // Start editing
  const handleEdit = (id, currentText) => {
    setEditingId(id);
    setEditInput(currentText);
  };

  // Save edited todo
  const handleSaveEdit = async (id) => {
    if (editInput.trim() === "") return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo: editInput }),
      });
      const updatedTodo = await res.json();
      setTodos(todos.map((t) => (t._id === id ? updatedTodo : t)));
      setEditingId(null);
      setEditInput("");
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditInput("");
  };

  return (
    <div className="app">
      <h1>Todo List</h1>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a task..."
        />
        <button style={{ backgroundColor: "green" }} onClick={handleAddTodo}>
          Add
        </button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className={todo.isCompleted ? "completed" : ""}>
            {editingId === todo._id ? (
              <>
                <input
                  type="text"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  autoFocus
                />
                <button
                  style={{ backgroundColor: "green" }}
                  onClick={() => handleSaveEdit(todo._id)}
                >
                  Save
                </button>
                <button
                  style={{ backgroundColor: "red" }}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span onClick={() => handleToggleComplete(todo._id)}>
                  {todo.todo}
                </span>
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(todo._id, todo.todo)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteTodo(todo._id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
