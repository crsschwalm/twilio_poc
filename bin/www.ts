#!/usr/bin/env node

import debugGen from "debug";
import http from "http";
import { AddressInfo } from "net";
import expressApp from "../src/server";

const debug = debugGen("twilio:server");

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3000");
expressApp.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(expressApp);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  debug(`Listening on port ${portToString(addr)}`);
}

function portToString(addr: string | AddressInfo | null) {
  if (typeof addr === "string") {
    return addr;
  }

  if (addr) {
    return addr.port.toString();
  }

  return `unknown`;
}
