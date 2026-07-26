module.exports = (io) => {

    io.on("connection", (socket) => {

        console.log("Connected:", socket.id);

        socket.on("create-room", (roomId) => {

            socket.join(roomId);

            socket.emit("room-created", roomId);

            console.log(`Room created: ${roomId}`);
        });

        socket.on("join-room", (roomId) => {

            socket.join(roomId);

            socket.emit("room-joined", roomId);

            socket.to(roomId).emit("user-connected");

            console.log(`${socket.id} joined ${roomId}`);
        });

        socket.on("offer", ({ roomId, sdp }) => {

            socket.to(roomId).emit("offer", sdp);

        });

        socket.on("answer", ({ roomId, sdp }) => {

            socket.to(roomId).emit("answer", sdp);

        });

        socket.on("ice-candidate", ({ roomId, candidate }) => {

            socket.to(roomId).emit("ice-candidate", candidate);

        });

        socket.on("disconnect", () => {

            console.log("Disconnected:", socket.id);

        });

    });

};