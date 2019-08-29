require("dotenv").config();
require("./config/database");

const { app, http } = require("./app");

async function Main() {
  try {
    await http.createServer(app).listen(app.get("port"));
    console.log(`Server running on https://localhost:${app.get("port")}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

Main();
