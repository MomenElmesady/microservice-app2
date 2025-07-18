require("dotenv").config();
const express = require("express");
const cors = require("cors");
const asc = require("./models/asc.js")
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const statusRoutes = require("./routes/statusRoutes.js");
const contactRoutes = require("./routes/contactRoutes.js");
const errorController = require("./helpers/errorController.js");
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/contact", contactRoutes);

app.use(errorController)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});

