// Importing all components
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');

dotenv.config();
connectDB(); // connecting to the MongoDB database

const app = express(); //intitialising express
config({
    path: "./config/config.env",
});
app.use(express.json()); // parse incoming json requests

//Routes
app.use('/api/users', userRoutes)
app.use('/api/groups', groupRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));

 