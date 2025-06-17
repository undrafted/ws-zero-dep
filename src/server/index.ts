import http from "http";
import { isOriginAllowed } from "./origin";
import { PORT } from "./config";

const server = http.createServer((_, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from TypeScript Node server!");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.on("upgrade", (req, socket, head) => {
  if (
    !(req.headers.upgrade?.toLocaleLowerCase() === "websocket") ||
    !(req.headers.connection?.toLowerCase() === "upgrade") ||
    (!req.method && req.method === "GET") ||
    !isOriginAllowed(req.headers.origin)
  ) {
    console.log("==============");
    console.log("Invalid Upgrade Request");
    console.log("==============");

    const message = "400 Bad Request: Invalid Upgrade Request";
    const response =
      `HTTP/1.1 400 Bad Request\r\n` +
      `Content-Type: text/plain\r\n` +
      `Connection: close\r\n` +
      `\r\n` +
      `${message}`;

    socket.write(response);
    socket.end();
    return;
  }

  upgradeConnection(req, socket, head);
});

const upgradeConnection = (
  req: http.IncomingMessage,
  socket: any,
  head: Buffer
) => {
  console.log("==============");
  console.log("Valid Upgrade Request");
  console.log("==============");
};
