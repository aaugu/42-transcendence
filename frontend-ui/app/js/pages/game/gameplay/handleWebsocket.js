import updateGameState from "./GameDraw.js";
import { urlRoute } from "../../../dom/router.js";
import { errormsg } from "../../../dom/errormsg.js";
import { hideModal } from "../../../dom/modal.js";
import { updateTournamentTable, newMatchCycle } from "../gameplay-tournament/updateTournament.js";
import { endGame } from "../gameplay/endGame.js";

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
        // console.log(
        //   `Paddle Left played_id, ${data.game_state.paddles[0].player_id}, score: ${data.game_state.score[0]}`
        // );
        // console.log(
        //   `Paddle Right played_id, ${data.game_state.paddles[1].player_id}, score: ${data.game_state.score[1]}`
        // );

        console.log("WinnerID", data.winner_id);
        console.log("LoserID", data.loser_id);
        console.log("GameID", data.game.game_id);

		await endGame(data.winner_id, data.loser_id, data.game.game_id);
      }
    } catch (error) {
      console.error("Error parsing message:", error.message);
      console.log("Raw message that caused error:", event.data);
    }
  };
}

export function handleWebsocketTournament(socket, tournament, canvas, gameState) {
	const player1html = document.getElementById("player1");
	const player2html = document.getElementById("player2");

	socket.onopen = function (event) {
		console.log("WebSocket connection opened:", event);
		console.log("current_match", tournament.current_match);
		player1html.innerText = tournament.current_match.player_1.nickname;
		player2html.innerText = tournament.current_match.player_2.nickname;
		updateTournamentTable(tournament.all_matches);
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
		try {
			// console.log("Raw message received:", event.data);
			const data = JSON.parse(event.data);

			if (data.game_state) {
				gameState.current = data.game_state;
				updateGameState(data.game_state, canvas);
			}

			if (data.game_finished) {
				console.log("Game Finished", data.game_finished);
				console.log("WinnerID", data.winner_id);
				console.log("LoserID", data.loser_id);

				const winner = data.winner_id == tournament.current_match.player_1.user_id ?
								tournament.current_match.player_1
							: tournament.current_match.player_2;

				console.log("Winner sent to tournament: ", winner);
				await tournament.updateMatchCycle(winner.user_id);

				console.log("current game status: ", tournament.game_status);
				console.log("current match: ", tournament.current_match);

				await endGame(data.winner_id, data.loser_id, data.game.game_id);

				const t_matchmodal = new bootstrap.Modal(document.getElementById("t-match-modal"));
				if (tournament.game_status === "In Progress") {
					document.getElementById("t-match-text").innerHTML = `
												<span>The winner is: ${winner.nickname}!</span>
												</br>
												<span>Next up: ${tournament.current_match.player_1.nickname}
												vs ${tournament.current_match.player_2.nickname}</span>`;
					t_matchmodal.show();
					setTimeout(() => {
					newMatchCycle(tournament);
					}, 3000);
				}
				else if (tournament.game_status === "Finished") {
					document.getElementById("t-match-text").innerText =
						`Congratulations ${winner.nickname}, you won this tournament!`;
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
