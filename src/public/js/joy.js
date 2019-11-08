const socket = io();

(function() {
  console.log(
    "touchscreen is",
    VirtualJoystick.touchScreenAvailable() ? "available" : "not available"
  );
  const joystick = new VirtualJoystick({
    container: document.getElementById("container"),
    mouseSupport: true,
    limitStickTravel: true
  });

  joystick.addEventListener("touchEnd", () => {
    socket.emit("Web_stop", { pi_stop: "stop" });
    result.innerHTML =
      '<img src="https://img.icons8.com/nolan/96/000000/stop-sign.png">';
  });
  joystick.addEventListener("mouseDown", () => {
    socket.emit("Web_stop", { pi_stop: "stop" });
    result.innerHTML =
      '<img src="https://img.icons8.com/nolan/96/000000/stop-sign.png">';
  });

  
setInterval(function() {
  if (joystick.right()) {
    socket.emit("Web_right", { pi_right: "right" });
    result.innerHTML =
      '<img src="https://img.icons8.com/nolan/96/000000/circled-right-2.png">';
  }
  if (joystick.left()) {
    socket.emit("Web_left", { pi_left: "left" });
    result.innerHTML =
      '<img src="https://img.icons8.com/nolan/96/000000/circled-left-2.png">';
  }
  if (joystick.up()) {
    socket.emit("Web_up", { pi_up: "up" });
    result.innerHTML =
      '<img src="https://img.icons8.com/nolan/96/000000/circled-up-2.png">';
  }
  if (joystick.down()) {
    socket.emit("Web_down", { pi_down: "down" });
    result.innerHTML =
      '<img src="https://img.icons8.com/nolan/96/000000/circled-down-2.png">';
  }
}, (1 / 30) * 1000);


  

})();








