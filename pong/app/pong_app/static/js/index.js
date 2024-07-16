console.log("Hello From index.js");

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

  // const canvasWidth = "{{ canvas_width }}";
  // const canvasHeight = "{{ canvas_height }}";
  // const ballRadius = "{{ ball_radius }}";
  // const paddleWidth = "{{ paddle_width }}";
  // const paddleHeight = "{{ paddle_height }}";

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
    if (keysPressed["j"]) {
      throttleSend({ direction_right_paddle: "up" });
      return;
    } else if (keysPressed["m"] || keysPressed["n"]) {
      throttleSend({ direction_right_paddle: "down" });
      return;
    } else if (keysPressed["f"]) {
      throttleSend({ direction_left_paddle: "up" });
      return;
    } else if (keysPressed["c"] || keysPressed["v"]) {
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
