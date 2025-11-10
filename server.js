import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import 'dotenv/config'

const app = express();

// Middleware
app.use(cors());

app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://thussain170305_db_user:mycluster123@mycluster.7xsorli.mongodb.net/Todoapp?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Todo schema
const todoSchema = new mongoose.Schema(
  {
    todo: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

// Routes

// Test route
app.get("/", (req, res) => {
  res.send("Hello Todo API");
});

// Get all todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new todo
app.post("/api/todos", async (req, res) => {
  try {
    console.log(req.body);
    const { todo } = req.body;
    console.log(todo);
    
    if (!todo) return res.status(400).json({ error: "Todo text is required" });

    const newTodo = new Todo({ todo });
    await newTodo.save();
    return res.json(newTodo);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update a todo
app.put("/api/todos/:id", async (req, res) => {
  try {
    const { todo, isCompleted } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { todo, isCompleted },
      { new: true }
    );
    if (!updatedTodo) return res.status(404).json({ error: "Todo not found" });

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) return res.status(404).json({ error: "Todo not found" });

    res.json({ message: "Todo deleted", todo: deletedTodo });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Toggle completion
app.patch("/api/todos/:id/toggle", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });

    todo.isCompleted = !todo.isCompleted;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000/");
});
