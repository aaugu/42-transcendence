DEBUG = 1;

class Ray {
  constructor(start, direction) {
      this.start = start;
      this.direction = direction;
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
  const canvas = document.getElementById("pongCanvas");
  console.log('window location host: ', window.location.host);

  

  const socket = new WebSocket("ws://" + 'localhost:9000' + "/ws/pong/");

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

    // console.log(ball);


    const score = gameState.scores;
    document.getElementById("score-p-1").textContent = score[0];
    document.getElementById("score-p-2").textContent = score[1];

    context.clearRect(0, 0, canvas.width, canvas.height);


    if (DEBUG) {
      // for (let i = 0; i < canvasHeight; i += 100) {
      //   context.fillText(i, 10, i);
      //   context.fillText(i, canvas.width - 50, i);
      //   context.beginPath();
      //   context.moveTo(0, i);
      //   context.lineTo(canvasWidth, i);
      //   context.stroke();
      // }
    }

    let ballRay = new Ray(ball.position, ball.velocity);
    // console.log(ballRay);
    let scaledDirection = {
      x: ballRay.direction[0] * 100,
      y: ballRay.direction[1] * 100,
    };

    let endPoint = {
      x: ballRay.start[0] + scaledDirection.x,
      y: ballRay.start[1] + scaledDirection.y,
    };

    // console.log(ballRay.start[0], ballRay.start[1], endPoint.x, endPoint.y);
    context.beginPath();
    context.moveTo(ballRay.start[0], ballRay.start[1]); // Move to the starting point of the ray
    context.lineTo(endPoint.x, endPoint.y); // Draw a line to the end point of the ray
    context.strokeStyle = "white";
    context.stroke(); // Stroke the path to make the ray visible

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
