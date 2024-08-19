import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import { availableParallelism } from "node:os";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
});

const __dirname = dirname(fileURLToPath(import.meta.url));

let count = 0;

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  io.emit("update", count);
  socket.on("change_count", (e) => {
    count += e == "add" ? 1 : -1;
    io.emit("update", count);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
