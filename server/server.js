const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Voting Application API is running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/elections", require("./routes/electionRoutes"));
app.use("/api/votes", require("./routes/voteRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
