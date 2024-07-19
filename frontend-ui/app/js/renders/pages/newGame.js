let html = `
    <div class="h-50 titles d-flex flex-column justify-content-around align-items-center">
        <div class="h1 main-content-title text-center">New Game</div>
        <div class="h3 main-content-sub-title w-75 text-center">Choose your type of game</div>
    </div>
    <div class="buttons h-50 d-flex flex-column flex-md-row justify-content-around align-items-center">
        <div class="select-btn btn btn-lightgrey w-100 d-flex justify-content-center align-items-center" id="2p-btn">
            <div>2 Player Game</div>
        </div>
        <div class="select-btn btn btn-lightgrey w-100 d-flex justify-content-center align-items-center" id="tournament-home-btn">
            <a href="#" class="text-break">Tournament Game</a>
        </div>
    </div>
`;

export function newGame() {
    document.getElementById("check").checked = false;
    return html;
}