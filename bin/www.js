require("dotenv").config();
const http = require("http");
const app = require("../src/app");

const { PORT = 3000 } = process.env;

const server = http.createServer(app.callback());
server.listen(PORT, async () => {
  console.log(`--------------------------------------`);
  console.log(`🚀 listening on http://localhost:${PORT}`);
  console.log(`--------------------------------------`);
});

server.on("error", () => {
  console.log("server error!");
});
