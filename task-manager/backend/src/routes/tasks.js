const express = require('express');
const router = express.Router();
const { Task, User } = require('../models');

// GET all tasks
router.get('/', async (req, res) => {
  const tasks = await Task.findAll({ include: { model: User, as: 'user' } });
  res.json(tasks);
});

// POST new task
router.post('/', async (req, res) => {
  const { title, status, userId } = req.body;
  const task = await Task.create({ title, status, userId });
  res.status(201).json(task);
});

// PUT update task
router.put('/:id', async (req, res) => {
  const { title, status } = req.body;
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  task.title = title ?? task.title;
  task.status = status ?? task.status;
  await task.save();
  res.json(task);
});

// DELETE task
router.delete('/:id', async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  await task.destroy();
  res.json({ message: 'Task deleted' });
});

module.exports = router;   // << ต้องมีตรงนี้

