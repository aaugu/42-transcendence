let html = `
	<div class="profile-box">
		<div class="info-ctn">
			<h2 class="text-bold mt-5">Click to start the game</h2>
		</div>
		<div class="canvas-ctn clearfix">
			<canvas id="pongCanvas"></canvas>
    	</div>
	</div>
`;

export function twoPlayerGamePage() {
    document.getElementById("check").checked = false;
    return html;
}