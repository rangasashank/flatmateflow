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
import taskScheduler from './utils/taskScheduler.js';

dotenv.config({
    path: "./config/config.env",
});

connectDB(); // connecting to the MongoDB database

const app = express(); //intitialising express
app.use(cookieParser());
app.use(json()); // parse incoming json requests

//Routes
app.use('/api/users', userRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/expenses', expenseRoutes);

taskScheduler();

const port = process.env.PORT || 5500;

app.listen(port, console.log(`Server running on port ${port}`));

 