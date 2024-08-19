import {Ray} from "./DrawUtils.js"


export default function updateGameState(gameState, canvas) {
	const ball = gameState.ball;
	const context = canvas.getContext("2d");

	// console.log(ball);

	const score = gameState.scores;
	document.getElementById("score-p-1").textContent = score[0];
	document.getElementById("score-p-2").textContent = score[1];

	context.clearRect(0, 0, canvas.width, canvas.height);

	// if (DEBUG) {
	// for (let i = 0; i < canvasHeight; i += 100) {
	//   context.fillText(i, 10, i);
	//   context.fillText(i, canvas.width - 50, i);
	//   context.beginPath();
	//   context.moveTo(0, i);
	//   context.lineTo(canvasWidth, i);
	//   context.stroke();
	// }
	// }

	let ballRay = new Ray(ball.position, ball.velocity);
	let scaledDirection = {
		x: ballRay.direction[0] * 3,
		y: ballRay.direction[1] * 3,
	};

	let endPoint = {
		x: ballRay.start[0] + scaledDirection.x,
		y: ballRay.start[1] + scaledDirection.y,
	};

	console.log(ballRay.start[0], ballRay.start[1], endPoint.x, endPoint.y);
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
