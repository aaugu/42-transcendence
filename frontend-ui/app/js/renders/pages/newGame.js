let html = `
    <div class="h-50 titles d-flex flex-column justify-content-around align-items-center py-3">
        <h1 class="main-content-title text-center">New Game</h1>
        <h3 class="main-content-sub-title w-75 text-center">Choose your type of game</h3>
    </div>
    <div class="mw-50 h-50 buttons d-flex justify-content-around align-items-center">
        <div class="btn btn-lightgrey text-dark text-break py-4 mb-2 w-100">2 Player Game</div>
        <div class="btn btn-lightgrey text-dark text-break py-4 mb-2 w-100"><a href="/tournament-home">Tournament Game</a></div>
    </div>
`;

export function newGame() {
    document.getElementById("check").checked = false;
    return html;
}