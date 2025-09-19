console.log("🚀 Starting server.......");

const express = require('express');
const { sequelize } = require('./models');
const usersRouter = require('./routes/users');
const tasksRouter = require('./routes/tasks');
require('dotenv').config();
const cors = require('cors'); 

const app = express();
app.use(cors());     
app.use(express.json());

app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync({ alter: true });
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('Failed to connect DB:', err);
  }
})();
