require("dotenv").config(); 

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const path = require("path");

const userRoutes = require("./src/modules/users/user.routes");
const projectRoutes = require("./src/modules/projects/project.routes");
const noteRoutes = require("./src/modules/notes/note.routes"); 
const clientRoutes = require("./src/modules/clients/client.routes"); 
const taskRoutes = require("./src/modules/tasks/task.routes");     
const planningRoutes = require("./src/modules/planning/planning.routes");
const fileRoutes = require("./src/modules/files/file.routes");

const app = express(); 

// 2. Connect Database
connectDB();

// 3. Middlewares
app.use(cors());
app.use(express.json()); 

// 4. Définition dyal les Routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/clients", clientRoutes); 
app.use("/api/tasks", taskRoutes);     
app.use("/api/plannings", planningRoutes);
// static folder for files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/files", fileRoutes);

// 5. Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});