var socket = io();

(function (){ 
  console.log(
    "touchscreen is",
    VirtualJoystick.touchScreenAvailable() ? "available" : "not available"
  );
  const joystick = new VirtualJoystick({
    container: document.getElementById("container"),
    mouseSupport: true,
    limitStickTravel: true
  });
  joystick.addEventListener("touchStart", () => {
    console.log("tocaste el joystick");
  });
  joystick.addEventListener("touchEnd", () => {
    console.log("Soltaste el joystick");
    socket.emit("Web_stop", { pi_stop: "stop" });
  });
  joystick.addEventListener("mouseDown", () => {
    console.log("Soltaste el joystick");
    socket.emit("Web_stop", { pi_stop: "stop" });
  });


  setInterval(function() {
    if (joystick.right()) {
      socket.emit("Web_right", { pi_right: "right" });
    }
    if (joystick.left()) {
      socket.emit("Web_left", { pi_left: "left" });
    }
    if (joystick.up()) {
      socket.emit("Web_up", { pi_up: "up" });
    }
    if (joystick.down()) {
      socket.emit("Web_down", { pi_down: "down" });
    }
  }, (1 / 30) * 1000);

})();


  

