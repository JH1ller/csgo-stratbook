const initWS = (io) => {
  io.on('connection', (socket) => {
    console.log('Websocket client connected with id: ', socket.conn.id);

    socket.on('join-room', (data) => {
      socket.join(data.teamID);
      io.to(data.teamID).emit('room-joined', `Joined room: ${data.teamID}`);
    });
  });
};

exports.initWS = initWS;
