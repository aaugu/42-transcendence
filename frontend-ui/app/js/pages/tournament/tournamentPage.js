let html = `
    <div class="two-column-container">
        <div class="column-left" style="flex: 1 1 40%;">
            <div class="content-box clearfix">
                <h5 class="m-3">Create a tournament</h5>
                <div class="form-group text-start m-2 w-75 centered clearfix">
                    <label class="form-label" for="tournament-name">Tournament name</label>
                    <input type="text" class="form-control" id="tournament-name" placeholder="">
                    <label class="form-label mt-3 for="tournament-players">How many players?</label>
                    <br>
                    <select class="custom-select custom-select-sm p-1" id="t-nr-players">
                        <option selected value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                    </select>
                </div>
                <div class="form-check text-start m-2 w-75 centered">
                    <input class="form-check-input" type="radio" name="tournament-players" id="t-local" value="default" checked>
                    <label class="form-check-label" for="tournament-local">
                        Local
                    </label>
                </div>
                <div class="form-check text-start m-2 w-75 centered">
                    <input class="form-check-input" type="radio" name="tournament-players" id="t-remote" value="upload">
                    <label class="form-check-label" for="tournament-remote">
                        Remote
                    </label>
                </div>
                <p class="hidden m-2 text-danger" id="t-create-errormsg"></p>
                <div>
                    <button type="submit" class="btn btn-dark mt-2" id="open-t-modal">Continue</button>
                </div>

                <!-- Tournament player names modal -->
				<div class="modal fade" id="t-modal-names" tabindex="-1" aria-labelledby="t-modal-names" aria-hidden="true">
					<div class="modal-dialog modal-dialog-centered">
						<div class="modal-content">
							<div class="modal-header">
								<h1 class="modal-title fs-5">Tournament players</h1>
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<div class="modal-body">
								<div id="t-modal-text"></div>
                                <p class="hidden m-2 text-danger" id="t-modal-errormsg"></p>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-lightgrey" data-bs-dismiss="modal">Close</button>
								<button type="button" class="btn btn-dark" id="t-modal-create">Create</button>
							</div>
						</div>
					</div>
				</div>
            </div>
        </div>
        <div class="column-right" style="flex: 1 1 40%;">
            <div class="content-box clearfix">
                <h5 class="m-2">Join a tournament</h5>
            </div>
        </div>
    </div>
`;

export function tournamentPage() {
    document.getElementById("check").checked = false;
	return html;
}

