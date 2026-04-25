require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = require("./src/config/db");
const userRoutes = require("./src/modules/users/user.routes");

const app = express();


// Connect Database
connectDB();


// Middlewares
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/users", userRoutes);


// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});