const rooms = new Map();

module.exports = (io) => {

    io.on("connection", (socket) => {

        console.log("=================================");
        console.log("NEXGUARD: User Connected");
        console.log("Socket ID:", socket.id);
        console.log("=================================");

        socket.on("create-room", () => {

            console.log("NEXGUARD: create-room received");
            console.log("From Socket:", socket.id);

            let roomId;

            do {
                roomId = Math.floor(
                    1000 + Math.random() * 9000
                ).toString();
            } while ([...rooms.values()].includes(roomId));

            socket.join(roomId);
            rooms.set(socket.id, roomId);

            console.log("NEXGUARD: Room Created");
            console.log("Room ID:", roomId);
            console.log("Owner:", socket.id);

            socket.emit("room-created", roomId);

            console.log("NEXGUARD: room-created sent to client");
        });

        socket.on("join-room", (roomId) => {

            console.log("NEXGUARD: join-room received");
            console.log("Room ID:", roomId);
            console.log("Socket ID:", socket.id);

            socket.join(roomId);
            rooms.set(socket.id, roomId);

            console.log(
                `NEXGUARD: ${socket.id} joined room ${roomId}`
            );

            socket.emit("room-joined", roomId);

            socket.to(roomId).emit("user-connected");

            console.log(
                `NEXGUARD: user-connected sent to room ${roomId}`
            );
        });

        socket.on("offer", (data) => {

            console.log("NEXGUARD: OFFER received");
            console.log("Room:", data.roomId);

            socket.to(data.roomId).emit("offer", data);

            console.log("NEXGUARD: OFFER forwarded");
        });

        socket.on("answer", (data) => {

            console.log("NEXGUARD: ANSWER received");
            console.log("Room:", data.roomId);

            socket.to(data.roomId).emit("answer", data);

            console.log("NEXGUARD: ANSWER forwarded");
        });

        socket.on("ice-candidate", (data) => {

            console.log("NEXGUARD: ICE candidate received");
            console.log("Room:", data.roomId);

            socket.to(data.roomId).emit(
                "ice-candidate",
                data
            );

            console.log("NEXGUARD: ICE candidate forwarded");
        });

        socket.on("disconnect", () => {

            console.log("=================================");
            console.log("NEXGUARD: User Disconnected");
            console.log("Socket ID:", socket.id);

            const roomId = rooms.get(socket.id);

            if (roomId) {

                socket.to(roomId).emit(
                    "user-disconnected"
                );

                rooms.delete(socket.id);

                console.log(
                    `NEXGUARD: Removed ${socket.id} from room ${roomId}`
                );
            }

            console.log("=================================");
        });
    });
};