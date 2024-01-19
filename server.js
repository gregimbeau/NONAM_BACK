require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pappersRoutes = require("./routes/pappers");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use("/pappers", pappersRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
