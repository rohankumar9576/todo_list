const express = require("express");
const bodyParser = require("body-parser");
const todoRoutes = require("./routes/todoRoutes");
const mongoose = require("mongoose");
const app = express();
mongoose
  .connect(
    "mongodb+srv://PradeepPatil:vp0T2toXsM1QqQAo@cluster0.h3sgz2m.mongodb.net/group52-dbt"
  )
  .then(() => console.log(`mongoDB connected`))
  .then((error) => console.log(error));
console.log("hi");
app.use(bodyParser.json());
app.use("/", todoRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
