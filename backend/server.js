require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./src/config/db");
//const authRoutes = require("./src/routes/auth.routes");

const app = express();


// Connect Database
connectDB();


// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());


// Routes
//app.use("/api/auth", authRoutes);


// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});