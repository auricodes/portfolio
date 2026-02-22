const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const issueRoutes = require("./routes/issues");

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);


app.get("/api/test", (req, res) => {
  res.json({ message: "Bug Tracker API working 🚀" });
});

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
