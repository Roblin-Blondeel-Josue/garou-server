import { Context } from "../context";

export const getIp = (request: any) => {
  if (!request.headers) return null;
  let ip =
    request?.headers["x-forwarded-for"] ||
    request?.connection.remoteAddress ||
    request?.socket?.remoteAddress ||
    (request?.connection?.socket
      ? request.req.connection.socket.remoteAddress
      : null) ||
    request?.ip ||
    null;
  return ip;
};
