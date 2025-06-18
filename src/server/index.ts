import http from "http";
import { PORT } from "./config";
import { listenToUpgradeEvent } from "./socket-connection";

const server = http.createServer((_, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from TypeScript Node server!");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

listenToUpgradeEvent(server);
