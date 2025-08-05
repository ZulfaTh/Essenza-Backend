const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const userRoutes=require('./routes/userRoute');
const cors = require('cors');

app.get("/", (req, res) => {
  res.send("hellooowww");
});

app.use(express.json());
app.use(cors());

//Db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("DB connected succesfully and listening to "+ process.env.PORT
      );
    });
  })
  .catch((error) => console.log(error));

  app.use('/api/users',userRoutes);
