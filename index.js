// Importing all components
import express, { json } from 'express';
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from './routes/userRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import cron from "node-cron";
import { processRecurringTasks } from "./controllers/taskController.js";
import cors from 'cors';
import { set } from 'mongoose';
import axios from 'axios';


dotenv.config({
    path: "./config/config.env",
});

connectDB(); // connecting to the MongoDB database

const app = express(); //intitialising express
app.use(cors({
    origin: ['https://flatmateflow.netlify.app', 'http://localhost:5173'], // Your frontend's origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
app.use(cookieParser());
app.use(json()); // parse incoming json requests

//Routes
app.use('/api/users', userRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/expenses', expenseRoutes);

// A simple function to keep the server running

const url = "https://flatmateflow.onrender.com";
const interval = 10 * 60 * 1000; // 10 minutes in milliseconds

function keepServerAlive() {
  axios.get(url).then(response => {console.log('Server is alive:', response.status);}).catch(error => {
    console.error('Error keeping server alive:', error.message);
  });
}

setInterval(keepServerAlive, interval);
// just to have to have a route with no body, so I can keep the server running using a cron job (render makes it sleep after 15 mins of inactivity)
app.get('/', (req, res) => {
    res.send('Welcome to Flatmate Flow API');
});
cron.schedule("0 2 * * *", async () => {
  console.log("Running recurring task scheduler...");
  await processRecurringTasks();
});

const port = process.env.PORT || 5500;

app.listen(port, console.log(`Server running on port ${port}`));

 