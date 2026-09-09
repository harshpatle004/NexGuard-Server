const rooms = new Map();

module.exports = (io) => {

    io.on("connection", (socket) => {

        console.log("User Connected:", socket.id);

        socket.on("create-room", () => {

    let roomId;

    do {
        roomId = Math.floor(1000 + Math.random() * 9000).toString();
    } while ([...rooms.values()].includes(roomId));

    socket.join(roomId);
    rooms.set(socket.id, roomId);

    console.log(`Room Created: ${roomId} by ${socket.id}`);

    socket.emit("room-created", roomId);
});

        socket.on("join-room", (roomId) => {

            socket.join(roomId);
            rooms.set(socket.id, roomId);

            socket.emit("room-joined", roomId);

            socket.to(roomId).emit("user-connected");
        });

        socket.on("offer", (data) => {

            socket.to(data.roomId).emit("offer", data);
        });

        socket.on("answer", (data) => {

            socket.to(data.roomId).emit("answer", data);
        });

        socket.on("ice-candidate", (data) => {

            socket.to(data.roomId).emit("ice-candidate", data);
        });

        socket.on("disconnect", () => {

            const roomId = rooms.get(socket.id);

            if (roomId) {
                socket.to(roomId).emit("user-disconnected");
                rooms.delete(socket.id);
            }

            console.log("User Disconnected:", socket.id);
        });
    });
};