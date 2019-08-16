const mongoose = require("mongoose");

const URI = process.env.MONGOOSE_URI
  ? process.env.MONGOOSE_URI
  : "mongodb://localhost/CarTest";

mongoose.connect(URI, { useNewUrlParser: true, useCreateIndex: true });

mongoose.connection.once("open", () => console.log("DB is conected"));
