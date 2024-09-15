import { joinGameandRedirect } from "./connection/joinGameandRedirect.js";

export async function joinGamePage() {
    const func = joinGameandRedirect();
  return `
        <div>
        <div class="info-ctn"></div> <!-- Ensure this is included -->
            <h2>Join a Game</h2>
            <input type="text" id="game-id-input" placeholder="Enter Game ID">
             <button type="button" onclick=${func}>Join the Game</button>
        </div>
        <canvas id="pongCanvas" class="hidden"</canvas>
    `;
}
