const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const taskRoutes = require("./routes/tasks");


const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
const authMiddleware = require("./middleware/authMiddleware"); // <-- QUESTO MANCAVA x errore al test della rotta protetta

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working 🚀" });
});
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "Accesso consentito 🔐", userId: req.user });
});

app.get("/", (req, res) => {
  res.send("API working");
}); //aggiunta x debug

const PORT = 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connesso")
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch(err => console.log(err));