let html = `
	<div class="content-box">
		<div class="info-ctn">
		</div>
		<div class="canvas-ctn clearfix">
			<canvas id="pongCanvas"></canvas>
    	</div>
		<div class="table-responsive">
			<table id="tournament-table" class="table hidden">
				<thead>
					<tr>
					<th scope="col">#</th>
					<th scope="col">Player 1</th>
					<th scope="col">Player 2</th>
					<th scope="col">Status</th>
					</tr>
				</thead>
				<tbody id="tournament-table-body" class="custom-scrollbar"></tbody>
			</table>
		</div>
	</div>
	<div class="modal fade" id="t-match-modal" tabindex="-1" aria-labelledby="t-match-modal" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-body">
					<div id="t-match-text"></div>
					<p class="hidden m-2 text-danger" id="t-match-modal-errormsg"></p>
				</div>
			</div>
		</div>
	</div>
`;

export function gamePage() {
    document.getElementById("check").checked = false;
	document.getElementById('nav-profile-elements').classList.remove('hidden');
	document.getElementById('logo').href = "/profile";
    return html;
}