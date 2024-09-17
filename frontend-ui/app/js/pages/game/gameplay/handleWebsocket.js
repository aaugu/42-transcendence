import  updateGameState  from "./GameDraw.js";
import { Tournament } from "../gameplay-tournament/tournamentClass.js";
import { urlRoute } from "../../../dom/router.js";
import { errormsg } from "../../../dom/errormsg.js";

export function handleWebsocketGame(socket, canvas, gameState) {
	socket.onopen = function(event) {
		console.log("WebSocket connection opened:", event);
	};

	socket.onclose = function(event) {
		console.log("WebSocket connection closed:", event);
	};

	socket.onerror = function(error) {
		console.error("WebSocket error:", error);
		urlRoute('/local-twoplayer');
		errormsg('Connection to game could not be established', "homepage-errormsg");
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
        formData.append("loser_id", data.loser_id);
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

export function handleWebsocketTournament(socket, tournament, canvas, gameState) {
	socket.onopen = function(event) {
		console.log("WebSocket connection opened:", event);
		console.log('current_match', tournament.current_match);
		document.getElementById("player1").innerText = tournament.current_match.player_1.nickname;
		document.getElementById("player2").innerText = tournament.current_match.player_2.nickname;
	};

	socket.onclose = function(event) {
		console.log("WebSocket connection closed:", event);
	};

	socket.onerror = function(error) {
		console.error("WebSocket error:", error);
		urlRoute('/tournament-creation');
		errormsg('Connection to game could not be established', "homepage-errormsg");
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
				console.log("WinnerID", data.winner_id);
				console.log("LoserID", data.loser_id);
				const winner = (data.winner_id === 1) ? current_match.player_1 : current_match.player_2

				tournament.updateMatchCycle(winner.id);
				if (tournament.game_status === 'In Progress') {
					const t_matchmodal = new bootstrap.Modal(document.getElementById('t-match-modal'));
					document.getElementById("t-match-text").innerText = `The winner is: ${winner.nickname}. Next match: ${tournament.current_match.player_1.nickname} vs ${tournament.current_match.player_2.nickname}`;
					document.getElementById("t-match-go").onclick = async function() {
						//reset game state and start next match
						//hide modal
					};
					t_matchmodal.show();
				}
				else if (tournament.game_status === 'Finished') {
					const t_matchmodal = new bootstrap.Modal(document.getElementById('t-match-modal'));
					document.getElementById("t-match-text").innerText = `Congratulations ${winner.nickname},you won this tournament!`;
					t_matchmodal.show();
					setTimeout(() => {
						t_matchmodal.show();
					}, 3000);
					//socket will close automatically upon page change
					urlRoute("/tournament-creation");
				}
			}
		} catch (error) {
			console.error("Error parsing message:", error);
			console.log("Raw message that caused error:", event.data);
		}
	};
}
