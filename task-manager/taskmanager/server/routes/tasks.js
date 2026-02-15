const express = require("express");
const Task = require("../models/task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE TASK
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;

    const newTask = new Task({
      title,
      user: req.user, // viene dal middleware
    });

    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Errore server" });
  }
});

// LISTA TASK
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Errore server" });
  }
});

// MODIFICA TASK
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user
    });

    if (!task) {
      return res.status(404).json({ message: "Task non trovata" });
    }

    task.title = req.body.title ?? task.title;
    task.completed = req.body.completed ?? task.completed;

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Errore server" });
  }
});

//AGGIORNARE LO STATO
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json(err);
  }
});


// ELIMINA TASK
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user
    });

    if (!task) {
      return res.status(404).json({ message: "Task non trovata" });
    }

    res.json({ message: "Task eliminata" });
  } catch (err) {
    res.status(500).json({ message: "Errore server" });
  }
});

module.exports = router;
