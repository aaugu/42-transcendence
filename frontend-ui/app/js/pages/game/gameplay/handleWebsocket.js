import updateGameState from "./GameDraw.js";
import { Tournament } from "../gameplay-tournament/tournamentClass.js";
import { urlRoute } from "../../../dom/router.js";
import { errormsg } from "../../../dom/errormsg.js";
import { hideModal } from "../../../dom/modal.js";

export function handleWebsocketGame(socket, canvas, gameState) {
  socket.onopen = function (event) {
    console.log("WebSocket connection opened:", event);
  };

  socket.onclose = function (event) {
    console.log("WebSocket connection closed:", event);
  };

  socket.onerror = function (error) {
    console.error("WebSocket error:", error);
    urlRoute("/profile");
    errormsg(
      "Connection to game could not be established",
      "homepage-errormsg"
    );
  };

  socket.onmessage = function (event) {
    // console.log("Raw message received:", event.data);
    try {
      const data = JSON.parse(event.data);
      // console.log("Parsed data:", data);

      if (data.game_state) {
        gameState.current = data.game_state;
        // console.log(`Current Game State: ${gameState.current}`);
        updateGameState(data.game_state, canvas);
      }

      if (data.game_finished) {
        console.log("Game Finished", data.game_finished);
        // console.log(
        //   `Paddle Left played_id, ${data.game_state.paddles[0].player_id}, score: ${data.game_state.score[0]}`
        // );
        // console.log(
        //   `Paddle Right played_id, ${data.game_state.paddles[1].player_id}, score: ${data.game_state.score[1]}`
        // );
        console.log("WinnerID", data.winner_id);
        console.log("LoserID", data.loser_id);
        console.log("GameID", data.game.game_id);
        let url = "https://localhost:10443/api/pong/end-game/";

        let formData = new FormData();
        formData.append("winner_id", data.winner_id);
        if (data.loser_id !== null) {
          formData.append("loser_id", data.loser_id);
        }
        formData.append("game_id", data.game.game_id);

        fetch(url, {
          method: "POST",
          body: formData,
          credentials: "include",
        })
          .then((response) => {
            if (!response.ok) {
              return response.text().then((text) => {
                throw new Error(
                  `Request failed with status ${response.status}: ${text}`
                );
              });
            }
            return response.json();
          })
          .then((data) => {
            console.log("Game Ended", data);
          })
          .catch((error) => {
            console.error("Error during fetch:", error);
          });
      }
    } catch (error) {
      console.error("Error parsing message:", error);
      console.log("Raw message that caused error:", event.data);
    }
  };
}

export function handleWebsocketTournament(
  socket,
  tournament,
  canvas,
  gameState
) {
  const player1html = document.getElementById("player1");
  const player2html = document.getElementById("player2");

  socket.onopen = function (event) {
    console.log("WebSocket connection opened:", event);
    console.log("current_match", tournament.current_match);
    player1html.innerText = tournament.current_match.player_1.nickname;
    player2html.innerText = tournament.current_match.player_2.nickname;
  };

  socket.onclose = function (event) {
    console.log("WebSocket connection closed:", event);
  };

  socket.onerror = function (error) {
    console.error("WebSocket error:", error);
    urlRoute("/tournament-creation");
    errormsg(
      "Connection to game could not be established",
      "homepage-errormsg"
    );
  };

  socket.onmessage = async function (event) {
    // console.log("Raw message received:", event.data);
    try {
      const data = JSON.parse(event.data);
      // console.log("Parsed data:", data);

      if (data.game_state) {
        gameState.current = data.game_state;
        // console.log(`Current Game State: ${gameState.current}`);
        updateGameState(data.game_state, canvas);
      }

      if (data.game_finished) {
        console.log("Game Finished", data.game_finished);
        console.log("WinnerID", data.winner_id);
        console.log("LoserID", data.loser_id);
        const winner =
          data.winner_id === 1
            ? tournament.current_match.player_1
            : tournament.current_match.player_2;

        console.log("Winner", winner);
        await tournament.updateMatchCycle(winner.user_id);
        console.log("current game status: ", tournament.game_status);
        console.log("current match: ", tournament.current_match);
        const t_matchmodal = new bootstrap.Modal(
          document.getElementById("t-match-modal")
        );
        if (tournament.game_status === "In Progress") {
          document.getElementById(
            "t-match-text"
          ).innerHTML = `<span>The winner is: ${winner.nickname} !</span>
																		</br>
																		<span>Next up: ${tournament.current_match.player_1.nickname} 
																		vs ${tournament.current_match.player_2.nickname}</span>`;
          player1html.innerText = tournament.current_match.player_1.nickname;
          player2html.innerText = tournament.current_match.player_2.nickname;
          t_matchmodal.show();
          setTimeout(() => {
            hideModal("t-match-modal");
          }, 3000);
        } else if (tournament.game_status === "Finished") {
          document.getElementById(
            "t-match-text"
          ).innerText = `Congratulations ${winner.nickname}, you won this tournament!`;
          t_matchmodal.show();
          setTimeout(() => {
            hideModal("t-match-modal");
            urlRoute("/tournament-creation");
          }, 5000);
        }
      }
    } catch (error) {
      console.error("Error parsing message:", error.message);
    }
  };
}
