const express = require("express");
const cors = require("cors");
const path = require("path");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { instructorRouter } = require("./routes/instructor");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5500", "http://127.0.0.1:5500"],
    credentials: true
}));
app.use(express.json());

// Serve static files (your frontend)
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use("/api/instructor", instructorRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);

// Serve frontend for any non-API routes
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
}

main();