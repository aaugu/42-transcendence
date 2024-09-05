let html = `
	<div class="content-box">
		<div class="info-ctn">
		</div>
		<div class="canvas-ctn clearfix">
			<canvas id="pongCanvas"></canvas>
    	</div>
	</div>
`;

export function gamePage() {
    document.getElementById("check").checked = false;
    return html;
}