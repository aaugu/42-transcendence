import { ballRadius, paddleWidth, paddleHeight } from "./GameConstants.js";


export default function updateGameState(gameState, canvas) {
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
