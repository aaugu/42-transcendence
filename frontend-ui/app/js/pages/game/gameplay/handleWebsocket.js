import updateGameState from "./GameDraw.js";
import { urlRoute } from "../../../dom/router.js";
import { errormsg } from "../../../dom/errormsg.js";
import { hideModal } from "../../../dom/modal.js";
import { updateTournamentTable, newMatchCycle, newMatchCycle_remote } from "../gameplay-tournament/updateTournament.js";
import { endGame } from "../gameplay/endGame.js";
import { userID } from "../../user/updateProfile.js";

export function handleWebsocketGame(socket, canvas, gameState) {
  socket.onopen = function (event) {
    console.log("WebSocket connection opened:", event);
  };

  socket.onclose = function (event) {
	if (event.wasClean === false) {
		errormsg("Service temporarily unavailable", "homepage-errormsg");
		setTimeout(() => {
			urlRoute("/profile");
		}, 3000);
	}
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
    try {
      const data = JSON.parse(event.data);

      if (data.game_state) {
        gameState.current = data.game_state;
        updateGameState(data.game_state, canvas);
      }

      if (data.player_disconnect) {
        console.log(data.message);
        console.log("Remaining player:", data.remaining_player);
        console.log("Disconnected player:", data.player_id);
        console.log("GameID", data.game_id);

		await endGame(data.remaining_player, data.player_id, data.game_id);
		urlRoute("/profile");
		errormsg("The game was interrupted due to the disconnection of your opponent", "homepage-errormsg");
      }

      if (data.game_finished) {
        console.log("Game Finished: ", data.game_finished);
		await endGame(data.winner_id, data.loser_id, data.game.game_id);
		if (parseInt(data.winner_id) === userID) {
			document.getElementById('homepage-errormsg').classList.add("bg-success");
			errormsg("Congratulations, you won !", 'homepage-errormsg');
		}
		else
			errormsg("Sorry, you lost...", 'homepage-errormsg');
		setTimeout(() => {
			document.getElementById('homepage-errormsg').classList.remove("bg-success");
			urlRoute("/profile");
		}, 3000);
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
		if (event.wasClean === false) {
			errormsg("Service temporarily unavailable", "homepage-errormsg");
			setTimeout(() => {
				urlRoute("/profile");
			}, 3000);
		}
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

				await tournament.updateMatchCycle(winner.user_id);

				console.log("current game status: ", tournament.game_status);
				console.log("current match: ", tournament.current_match);

				await endGame(data.winner_id, data.loser_id, data.game.game_id);

				const t_matchmodal = new bootstrap.Modal(document.getElementById("t-match-modal"));
				if (tournament.game_status === "In Progress" && tournament.current_match) {
					document.getElementById("t-match-text").innerHTML = `
												<span>The winner is: ${winner.nickname}!</span>
												</br>
												<span>Next up: ${tournament.current_match.player_1.nickname}
												vs ${tournament.current_match.player_2.nickname}</span>`;
					t_matchmodal.show();
					setTimeout(async () => {
					await newMatchCycle(tournament);
					}, 3000);
				}
				else if (tournament.game_status === "Finished") {
					document.getElementById("t-match-text").innerText =
						`Congratulations ${winner.nickname}, you won this tournament!`;
						t_matchmodal.show();
					setTimeout(() => {
						hideModal("t-match-modal");
						urlRoute("/tournament-creation");
					}, 3000);
				}
			}
		} catch (error) {
			if (error.message === "500" || error.message === "502") {
				urlRoute("/tournament-creation");
				errormsg(
					"Tournament could not be properly continued due to a server error",
					"homepage-errormsg"
				);
			}
		}
	};
}

export function handleWebsocketTournament_remote(socket, tournament, canvas, gameState) {
	const player1html = document.getElementById("player1");
	const player2html = document.getElementById("player2");
	const is_exec_player = tournament.current_match.player_1.user_id === userID;

	socket.onopen = function (event) {
		const pos = is_exec_player ? "left" : "right";
		socket.send(JSON.stringify({ position: pos }));

		// console.log("WebSocket connection opened:", event);
		console.log("current_match", tournament.current_match);
		player1html.innerText = tournament.current_match.player_1.nickname;
		player2html.innerText = tournament.current_match.player_2.nickname;
		updateTournamentTable(tournament.all_matches);
	};

	socket.onclose = function (event) {
		console.log("WebSocket connection closed:", event);
	};

	socket.onerror = function (error) {
		// console.error("WebSocket error:", error);
		urlRoute("/tournament-creation");
		errormsg(
			"Connection to game could not be established",
			"homepage-errormsg"
		);
	};

	socket.onmessage = async function (event) {
		try {
			// console.log("Event data: ", event);
			const data = JSON.parse(event.data);

			if (data.game_state) {
				gameState.current = data.game_state;
				updateGameState(data.game_state, canvas);
			}

			if (data.player_disconnect) {
				// console.log(data.message);
				// console.log("Remaining player:", data.remaining_player);
				// console.log("Disconnected player:", data.player_id);
				// console.log("GameID", data.game_id);
				await endGame(data.remaining_player, data.player_id, data.game_id);
				await tournament.endMatch(data.remaining_player);
				tournament.updateMatchCycle_remote();
				await newMatchCycle_remote(tournament);
				urlRoute("/profile");
				// errormsg("Your opponent disconnected, you won this game", "homepage-errormsg");
			}

			if (data.game_finished) {
				// console.log("Game Finished", data.game_finished);
				console.log("WinnerID", data.winner_id);
				console.log("LoserID", data.loser_id);

				const winner = data.winner_id == tournament.current_match.player_1.user_id ?
							tournament.current_match.player_1
							: tournament.current_match.player_2;

				if (is_exec_player){
					await endGame(data.winner_id, data.loser_id, data.game.game_id);
					await tournament.endMatch(data.winner_id);
				}
				await tournament.updateMatchCycle_remote();

				const t_matchmodal = new bootstrap.Modal(document.getElementById("t-match-modal"));
				if (tournament.game_status === "In Progress" && tournament.current_match) {
					document.getElementById("t-match-text").innerText = `Congratulations ${winner.nickname}, you won this match!`;
					if (is_exec_player)
						await newMatchCycle_remote(tournament);
				}
				else if (tournament.game_status === "Finished") {
					document.getElementById("t-match-text").innerText =
						`This was the last match of this tournament. Congratulations ${winner.nickname}, you won!`;
				}
				t_matchmodal.show();
				setTimeout(() => {
					hideModal("t-match-modal");
					urlRoute("/profile");
					return ;
				}, 3000);
			}
		} catch (error) {
			hideModal("t-match-modal");
			if (error.message === "500" || error.message === "502") {
				urlRoute("/tournament-creation");
				errormsg(
					"Tournament could not be properly continued due to a server error",
					"homepage-errormsg"
				);
			}
			if (error.message === "403") {
				urlRoute("/profile");
				errormsg("You were redirected to the landing page", "homepage-errormsg");
			}
			if (error.message === "409") {
				urlRoute("/profile");
			}
		}
	};
}
