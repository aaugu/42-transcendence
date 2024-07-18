let html = `
    <div id="main-content" class="h-75 bg-white p-4">
        <div class="h-50 titles d-flex flex-column justify-content-around align-items-center">
            <div class="text-center h1">Tournament</div>
            <p class="text-center w-75">Do you want to join an existing tournament or create your own ?</p>
        </div>
        <div class="buttons h-50 d-flex flex-column flex-md-row justify-content-around align-items-center">
            <div class="select-btn btn btn-dark w-100 d-flex justify-content-center align-items-center" id="join-tournament-btn">
                <a class="text-white text-break" href="/tournaments">Join tournament</a>
            </div>
            <div class="select-btn btn btn-lightgrey w-100 d-flex justify-content-center align-items-center" id="create-tournament-btn">
                <a class="text-break" href="/new-tournament">Create Tournament</a>
            </div>
        </div>
    </div>
`;

export function tournamentHome() {
    document.getElementById("check").checked = false;
	return html;
}

  