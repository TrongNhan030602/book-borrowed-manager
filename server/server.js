const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");

async function startServer() {
  try {
    await MongoDB.connect(config.db.uri);
    console.log("Connected to MongoDB");

    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`Server is running on  http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Failed to connect to MongoDB", error);
    process.exit();
  }
}

startServer();
