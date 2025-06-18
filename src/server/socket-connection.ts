import { IncomingMessage, Server, ServerResponse } from "http";
import { isOriginAllowed } from "./origin";
import { Duplex } from "stream";
import { generateUpgradeHeaders } from "./headers";

const upgradeConnection = (
  req: IncomingMessage,
  socket: Duplex,
  head: Buffer
) => {
  const upgradeHeaders = generateUpgradeHeaders(
    req.headers["sec-websocket-key"] as string
  );

  socket.write(upgradeHeaders);
};

const startWebSocketCommunication = (socket: Duplex) => {
  console.log("==============");
  console.log("WebSocket connection established");
  console.log("==============");
};

export const listenToUpgradeEvent = (
  server: Server<typeof IncomingMessage, typeof ServerResponse>
) => {
  server.on("upgrade", (req, socket, head) => {
    if (
      !(req.headers.upgrade?.toLocaleLowerCase() === "websocket") ||
      !(req.headers.connection?.toLowerCase() === "upgrade") ||
      (!req.method && req.method === "GET") ||
      !req.headers["sec-websocket-key"] ||
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
    startWebSocketCommunication(socket);
  });
};
