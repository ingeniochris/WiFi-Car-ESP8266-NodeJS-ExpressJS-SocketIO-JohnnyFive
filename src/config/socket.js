const { http } = require("../app");
const io = require("socket.io")(http);

io.on("connection", socket => {
  socket.emit("conectate", { connected: true });
  console.log("Un usuario conectado ID :", socket.id);

  socket.on("Web_up", data => {
    var mensajeweb_up = data.pi_up;
    console.log(
      "Cliente web ID:" + socket.id + " Adelante :" + mensajeweb_up
    );

    io.emit("ParaWemos_up", { mensajeweb_up });
  });

  socket.on("Web_down", data => {
    var mensajeweb_down = data.pi_down;
    console.log(
      "Cliente web ID:" + socket.id + " Atras :" + mensajeweb_down
    );

    io.emit("ParaWemos_down", { mensajeweb_down });
  });

  socket.on("Web_right", data => {
    var mensajeweb_right = data.pi_right;
    console.log(
      "Cliente web ID:" + socket.id + " Derecha :" + mensajeweb_right
    );

    io.emit("ParaWemos_right", { mensajeweb_right });
  });

  socket.on("Web_left", data => {
    var mensajeweb_left = data.pi_left;
    console.log(
      "Cliente web ID:" + socket.id + " Izquierda :" + mensajeweb_left
    );

    io.emit("ParaWemos_left", { mensajeweb_left });
  });

  socket.on("Web_stop", data => {
    var mensajeweb_stop = data.pi_stop;
    console.log(
      "Cliente web ID:" + socket.id + " Stop:" + mensajeweb_stop
    );

    io.emit("ParaWemos_stop", { mensajeweb_stop });
  });

  socket.on("disconnect", function onDisconnect() {
    io.emit("Cliente desconectado");
    console.log("Desconectado ID :", socket.id);
  });
});

