export async function joinGamePage() {
    return `
        <div>
            <h2>Join a Game</h2>
            <input type="text" id="game-id-input" placeholder="Enter Game ID">
            <button class="btn btn-dark" id="join-button">Join Game</button>
        </div>
    `;
}