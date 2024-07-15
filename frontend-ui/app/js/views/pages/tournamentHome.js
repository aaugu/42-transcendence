let html = `
    <div class="h-50 titles d-flex flex-column justify-content-around align-items-center py-3">
        <h1 class="main-content-title text-center">Tournament</h1>
        <h3 class="main-content-sub-title w-75 text-center">Do you want to join an existing tournament or create your own ?</h3>
    </div>
    <div class="mw-50 h-50 buttons d-flex justify-content-around align-items-center">
        <a class="btn btn-dark text-white text-break p-5" href="/tournaments">Join tournament</a>
        <a class="btn btn-lightgrey text-dark text-break p-5" href="/new-tournament">Create Tournament</a>
    </div>
`;

export function tournamentHome() {
	return html;
}

  