const GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
import crypto from "crypto";

export const generateAcceptKey = (key: string): string => {
  return crypto
    .createHash("sha1")
    .update(key + GUID)
    .digest("base64");
};

export const generateUpgradeHeaders = (clientKey: string) => {
  const headers = [
    "HTTP/1.1 101 Switching Protocols",
    "Upgrade: websocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${generateAcceptKey(clientKey as string)}`,
  ];

  return headers.join("\r\n") + "\r\n\r\n";
};
