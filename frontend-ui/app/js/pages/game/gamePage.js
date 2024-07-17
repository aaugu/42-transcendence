export function gamePage() {
    return `
    <h1 class="text-bold display-3">New Game!</h1>
    <br>
    <h2 class="small m-3">Choose your type of game</h2>
    <br>
    <row class="justify-content-center">
        <button type="submit" class="btn btn-dark" id="signin">Two players</button>
        <button type="submit" class="btn btn-light" id="signup">Tournament</button>
    </row> 
    `;
}
