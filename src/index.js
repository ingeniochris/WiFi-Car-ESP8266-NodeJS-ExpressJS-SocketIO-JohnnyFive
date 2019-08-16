require("dotenv").config();
require("./config/database");

const app = require("./app");

async function Main() {
  await app.listen(app.get("port"));
  console.log(`server running in http://localhost:${app.get("port")}`);
}

Main();
