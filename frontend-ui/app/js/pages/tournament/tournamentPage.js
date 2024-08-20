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
                    <select class="custom-select custom-select-sm p-1" id="tournament-players">
                        <option selected>Choose</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                    </select>
                </div>
                <row>
                    <button type="submit" class="btn btn-dark mt-2" id="create-tournament">Create</button>
                </row>
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

