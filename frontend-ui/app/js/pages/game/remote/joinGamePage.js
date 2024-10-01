export async function joinGamePage() {
  return `
        <div>
        <div class="info-ctn"></div> <!-- Ensure this is included -->
            <h2>Join a Game</h2>
            <input type="text" id="game-id" placeholder="Enter Game ID">
             <button id="chat-invite-game-link" class="btn btn-dark">Let's play Pong</button>
        </div>
        <canvas id="pongCanvas" class="hidden"</canvas>
    `;
}
