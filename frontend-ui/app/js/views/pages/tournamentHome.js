let html = `
    <div class="h-50 titles d-flex flex-column justify-content-around align-items-center py-3">
        <h1 class="main-content-title text-center">Tournament</h1>
        <h3 class="main-content-sub-title w-75 text-center">Do you want to join an existing tournament or create your own ?</h3>
    </div>
    <div class="mw-50 h-50 buttons d-flex justify-content-around align-items-center">
        <div class="btn btn-dark py-3 mb-2 w-100"><a class="text-white text-break" href="/tournaments">Join tournament</a></div>
        <div class="btn btn-lightgrey py-3 mb-2 w-100"><a class="text-break" href="/new-tournament">Create Tournament</a></div>
    </div>
`;

export function tournamentHome() {
    document.getElementById("check").checked = false;
	return html;
}

  