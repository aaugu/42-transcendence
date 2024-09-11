export async function tournamentPage() {

	return `
    <div class="two-column-container">
        <div class="column-left" style="flex: 1 1 40%;">
            <div class="content-box clearfix">
                <h5 class="m-3">Create a tournament</h5>
                <div class="form-group text-start m-2 w-75 centered clearfix">
                    <label class="form-label" for="tournament-name">Tournament name</label>
                    <input type="text" class="form-control" id="tournament-name" placeholder="">
                    <label class="form-label mt-3 for="tournament-players">How many players?</label>
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
                    <button type="submit" class="btn btn-dark mt-2" id="open-create-t-modal">Continue</button>
                </div>

                <!-- Tournament player names modal -->
				<div class="modal fade" id="create-t-modal" tabindex="-1" aria-labelledby="create-t-modal" aria-hidden="true">
					<div class="modal-dialog modal-dialog-centered">
						<div class="modal-content">
							<div class="modal-header">
								<h1 class="modal-title fs-5">Tournament players</h1>
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<div class="modal-body">
								<div id="create-t-modal-text"></div>
                                <p class="hidden m-2 text-danger" id="t-modal-errormsg"></p>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-lightgrey" data-bs-dismiss="modal">Close</button>
								<button type="button" class="btn btn-dark" id="t-create">Create</button>
							</div>
						</div>
					</div>
				</div>
            </div>
        </div>
        <div class="column-right" style="flex: 1 1 40%;">
            <div class="content-box clearfix">
                <h5 class="m-2">Join a tournament</h5>
                <ul id="tournament-list" class="list-group d-flex flex-grow-1 custom-scrollbar m-2">
                </ul>
            </div>
        </div>
        <!-- Join/start/play tournament modal -->
        <div class="modal fade" id="single-t-modal" tabindex="-1" aria-labelledby="single-t-modal" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                    <h1 class="modal-title fs-5" id="single-t-modal-title"></h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="single-t-modal-text"></div>
                        <p class="hidden m-2 text-danger" id="single-t-modal-errormsg"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-lightgrey" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-dark hidden" id="t-join">Join</button>
                        <button type="button" class="btn btn-dark hidden" id="t-start">Start</button>
                        <button type="button" class="btn btn-dark hidden" id="t-play">Play</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
}

