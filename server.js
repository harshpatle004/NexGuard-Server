const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get("/", (req, res) => {
    res.send("NexGuard Signaling Server is running");
});

io.on("connection", (socket) => {
    console.log("Device connected:", socket.id);

    socket.on("join-room", (roomId) => {
        socket.join(roomId);

        console.log(`${socket.id} joined room ${roomId}`);

        socket.to(roomId).emit("device-connected", socket.id);
    });

    socket.on("offer", ({ roomId, offer }) => {
        console.log("Offer received");

        socket.to(roomId).emit("offer", {
            offer,
            senderId: socket.id
        });
    });

    socket.on("answer", ({ roomId, answer }) => {
        console.log("Answer received");

        socket.to(roomId).emit("answer", {
            answer,
            senderId: socket.id
        });
    });

    socket.on("ice-candidate", ({ roomId, candidate }) => {
        socket.to(roomId).emit("ice-candidate", {
            candidate,
            senderId: socket.id
        });
    });

    socket.on("disconnect", () => {
        console.log("Device disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`NexGuard signaling server running on port ${PORT}`);
});