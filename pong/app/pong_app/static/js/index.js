DEBUG = 1;

document.addEventListener("DOMContentLoaded", (event) => {
  const canvas = document.getElementById("pongCanvas");

  const socket = new WebSocket("ws://" + window.location.host + "/ws/pong/");

  socket.onopen = function () {
    console.log("Websocket connection established");
  };

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (data.game_state) {
      updateGameState(data.game_state);
    }
  };

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  let keysPressed = {};

  document.addEventListener("keydown", function (event) {
    keysPressed[event.key] = true;
    handleKeyPress();
  });

  document.addEventListener("keyup", function (event) {
    keysPressed[event.key] = false;
    handleKeyPress();
  });

  const startButton = document.getElementById("start-button");
  const stopButton = document.getElementById("stop-button");
  const resetButton = document.getElementById("reset-button");

  if (startButton) {
    startButton.addEventListener("click", () => {
      console.log("Start button clicked");
      socket.send(JSON.stringify({ action: "start" }));
    });
  } else {
    console.error("Start button not found");
  }

  if (stopButton) {
    stopButton.addEventListener("click", () => {
      console.log("Stop button clicked");
      socket.send(JSON.stringify({ action: "pause" }));
    });
  } else {
    console.error("Stop button not found");
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      console.log("Reset button clicked");
      socket.send(JSON.stringify({ action: "reset" }));
    });
  } else {
    console.error("Reset button not found");
  }

  function throttle(fn, wait) {
    let lastCall = 0;
    return function (...args) {
      const now = new Date().getTime();
      if (now - lastCall < wait) {
        return;
      }
      lastCall = now;
      return fn(...args);
    };
  }

  const throttleSend = throttle((direction) => {
    socket.send(JSON.stringify(direction));
  }, 50);

  function handleKeyPress() {
    count = 0;
    if (DEBUG) {
      console.log((count += 1));
      console.log("Controller Right Up:", controllerRightUp);
      console.log("Controller Right Down:", controllerRightDown);
      console.log("Controller Left Up:", controllerLeftUp);
      console.log("Controller Left Down:", controllerLeftDown);
    }
    if (keysPressed[controllerRightUp]) {
      throttleSend({ direction_right_paddle: "up" });
      return;
    } else if (keysPressed[controllerRightDown]) {
      throttleSend({ direction_right_paddle: "down" });
      return;
    } else if (keysPressed[controllerLeftUp]) {
      throttleSend({ direction_left_paddle: "up" });
      return;
    } else if (keysPressed[controllerLeftDown]) {
      throttleSend({ direction_left_paddle: "down" });
      return;
    }
  }

  function updateGameState(gameState) {
    const ball = gameState.ball;
    const context = canvas.getContext("2d");

    const score = gameState.scores;
    document.getElementById("score-p-1").textContent = score[0];
    document.getElementById("score-p-2").textContent = score[1];

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.strokeStyle = "white";
    context.stroke();

    context.beginPath();
    context.moveTo(0, canvas.height / 2);
    context.lineTo(canvas.width, canvas.height / 2);
    context.strokeStyle = "white";
    context.stroke();

    if (DEBUG) {
      for (let i = 0; i < canvasHeight; i += 100) {
        context.fillText(i, 10, i);
        context.fillText(i, canvas.width - 50, i);
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(canvasWidth, i);
        context.strokeStyle = "rgba(255, 255, 255, 0.5)"; // Change the opacity value (0.5) as desired
        context.stroke();
      }
    }

    context.beginPath();
    context.arc(
      ball.position[0],
      ball.position[1],
      parseInt(ballRadius),
      0,
      2 * Math.PI
    );
    context.fillStyle = "white";
    context.fill();
    context.closePath();

    gameState.paddles.forEach((paddle) => {
      context.beginPath();
      context.rect(
        paddle.position[0],
        paddle.position[1],
        parseInt(paddleWidth),
        parseInt(paddleHeight)
      );
      context.fillStyle = "white";
      context.fill();
      context.closePath();
    });
  }
});
