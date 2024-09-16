import { joinGameandRedirect } from "./remote/joinGameandRedirect.js";

export async function joinGamePage() {
  return `
        <div>
        <div class="info-ctn"></div> <!-- Ensure this is included -->
            <h2>Join a Game</h2>
             <a id="chat-invite-game-link" data-gameid="cfe81108-0e19-443c-972a-aec7c727f5dc" data-senderid="1" href='#'>Let's play Pong</a>
        </div>
        <canvas id="pongCanvas" class="hidden"</canvas>
    `;
}
