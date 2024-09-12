export function joinGameEvent() {
    const joinButton = document.getElementById("join-button");
    joinButton.addEventListener("click", async () => {
        const gameId = document.getElementById("game-id-input").value;
        console.log("GameID entered by user:", gameId);
        if (gameId) {
            try {
                await joinGame(gameId);
                console.log("JOIN GAME SUCCESS");
            }
            catch (error) {
                console.error("JOIN GAME ERROR:", error);
            }
        }
        else {
            console.error("JOIN GAME ERROR: No GameID entered by user");
        }
    })
}