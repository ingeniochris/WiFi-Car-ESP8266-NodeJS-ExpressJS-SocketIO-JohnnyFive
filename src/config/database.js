const mongoose = require("mongoose");

const URI = process.env.MONGODB_CLUSTER
  ? process.env.MONGODB_CLUSTER
  : "mongodb://localhost/CarTest";

mongoose.connect(URI, { useNewUrlParser: true, useCreateIndex: true });

mongoose.connection.once("open", () => console.log("DB is conected"));
