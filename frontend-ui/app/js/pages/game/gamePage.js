let html = `
	<div class="content-box">
		<div class="info-ctn">
		</div>
		<div class="canvas-ctn clearfix">
			<canvas id="pongCanvas"></canvas>
    	</div>
	</div>
	<div class="modal fade" id="t-match-modal" tabindex="-1" aria-labelledby="t-match-modal" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-body">
					<div id="t-match-text"></div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-dark" id="t-match-go">Go</button>
				</div>
			</div>
		</div>
	</div>
`;

export function gamePage() {
    document.getElementById("check").checked = false;
    return html;
}