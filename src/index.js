require("dotenv").config();
require("./config/database");
var { app, http } = require("./app");

async function Main() {
  try {
    await http.listen(app.get("port"));
    console.log(`Server running on https://localhost:${app.get("port")}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

Main();
