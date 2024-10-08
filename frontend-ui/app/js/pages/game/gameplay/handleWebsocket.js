import updateGameState from "./GameDraw.js";
import { urlRoute } from "../../../dom/router.js";
import { errormsg } from "../../../dom/errormsg.js";
import { hideModal } from "../../../dom/modal.js";
import { updateTournamentTable, startNewMatchCycle, startNewMatchCycle_remote } from "../gameplay-tournament/updateTournament.js";
import { endGame } from "../gameplay/endGame.js";
import { userID } from "../../user/updateProfile.js";

export function handleWebsocketGame(socket, canvas, gameState) {
	socket.onopen = function (event){};

	socket.onclose = function (event) {
		if (event.wasClean === false) {
			localStorage.removeItem('right');
			localStorage.removeItem('left');
			urlRoute("/profile");
			errormsg("Connection lost or could not be established", "homepage-errormsg");
		}
	};

	socket.onerror = function (error) {
		localStorage.removeItem('right');
		localStorage.removeItem('left');
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
				await endGame(data.remaining_player[0], data.player_id, data.game_id);
				localStorage.removeItem('right');
				localStorage.removeItem('left');
				urlRoute("/profile");
				errormsg("The game was interrupted due to the disconnection of your opponent", "homepage-errormsg");
			}

			if (data.game_finished) {
				if ((data.game.mode == "REMOTE" && data.winner_id == userID) || data.game.mode == "LOCAL_TWO_PLAYERS")
					await endGame(data.winner_id, data.loser_id, data.game.game_id);
				const matchmodal = new bootstrap.Modal(document.getElementById("match-modal"));
				if (data.winner_id == userID)
					document.getElementById("match-modal-text").innerText = `Congratulations, you won!`;
				else
					document.getElementById("match-modal-text").innerText = `Sorry, you lost!`;
				matchmodal.show();
				localStorage.removeItem('right');
				localStorage.removeItem('left');
				setTimeout(() => {
					hideModal("match-modal");
					urlRoute("/profile");
					return ;
				}, 2000);
			}
		} catch (error) {
			if (error.message === "500" || error.message === "502") {
				errormsg("Service temporarily unavailable", "homepage-errormsg");
			} else if (error.message === "409") {
				errormsg("Game conflict", "homepage-errormsg");
				setTimeout(() => {
					urlRoute("/profile");
				}, 2000);
			} else {
				errormsg(error.message, "homepage-errormsg");
			}
		};
	}
}


export function handleWebsocketTournament(socket, tournament, canvas, gameState) {
	const player1html = document.getElementById("player1");
	const player2html = document.getElementById("player2");

	socket.onopen = function (event) {
		player1html.innerText = tournament.current_match.player_1.nickname;
		player2html.innerText = tournament.current_match.player_2.nickname;
		updateTournamentTable(tournament.all_matches);
	};

	socket.onclose = function (event) {
		if (event.wasClean === false) {
			errormsg("Service temporarily unavailable", "homepage-errormsg");
			setTimeout(() => {
				urlRoute("/profile");
			}, 2000);
		}
	};

	socket.onerror = function (error) {
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
				const winner = data.winner_id == tournament.current_match.player_1.user_id ?
							tournament.current_match.player_1
							: tournament.current_match.player_2;

				await tournament.updateMatchCycle(winner.user_id);
				await endGame(data.winner_id, data.loser_id, data.game.game_id);

				const t_matchmodal = new bootstrap.Modal(document.getElementById("match-modal"));
				if (tournament.game_status === "In Progress" && tournament.current_match) {
					document.getElementById("match-modal-text").innerHTML = `
												<span>The winner is: ${winner.nickname}!</span>
												</br>
												<span>Next up: ${tournament.current_match.player_1.nickname}
												vs ${tournament.current_match.player_2.nickname}</span>`;
					t_matchmodal.show();
					setTimeout(async () => {
						await startNewMatchCycle(tournament);
					}, 3000);
				}
				else if (tournament.game_status === "Finished") {
					document.getElementById("match-modal-text").innerText =
						`${winner.nickname} won this tournament!`;
						t_matchmodal.show();
					setTimeout(() => {
						hideModal("match-modal");
						urlRoute("/tournament-creation");
					}, 2000);
				}
			}
		} catch (error) {
			if (error.message === "500" || error.message === "502") {
				urlRoute("/tournament-creation");
				errormsg(
					"Tournament could not be properly continued due to a server error",
					"homepage-errormsg"
				);
			} else {
				errormsg(error.message, "homepage-errormsg");
			}
		}
	};
}

export function handleWebsocketTournament_remote(socket, tournament, canvas, gameState) {
	const player1html = document.getElementById("player1");
	const player2html = document.getElementById("player2");
	const is_player1 = tournament.current_match.player_1.user_id === userID;

	socket.onopen = function (event) {
		player1html.innerText = tournament.current_match.player_1.nickname;
		player2html.innerText = tournament.current_match.player_2.nickname;
		updateTournamentTable(tournament.all_matches);
	};

	socket.onclose = function (event) {
	};

	socket.onerror = function (error) {
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
				const winner = data.winner_id == tournament.current_match.player_1.user_id ?
							tournament.current_match.player_1
							: tournament.current_match.player_2;

				if (is_player1) {
					await endGame(data.winner_id, data.loser_id, data.game.game_id);
					await tournament.endMatch(data.winner_id);
				}
				await tournament.updateMatchCycle_remote();

				const t_matchmodal = new bootstrap.Modal(document.getElementById("match-modal"));
				if (tournament.game_status === "In Progress" && tournament.current_match) {
					document.getElementById("match-modal-text").innerText = `${winner.nickname} won this match!`;
					if (is_player1) {
						await startNewMatchCycle_remote(tournament);
					}
				}
				else if (tournament.game_status === "Finished") {
					document.getElementById("match-modal-text").innerText =
						`This was the last match of this tournament. ${winner.nickname} is the winner!`;
				}

				t_matchmodal.show();
				setTimeout(() => {
					hideModal("match-modal");
					urlRoute("/profile");
					return ;
				}, 2000);
			}

			if (data.player_disconnect) {
				await endGame(data.remaining_player[0], data.player_id, data.game_id);
				await tournament.endMatch(data.remaining_player[0]);
				await tournament.updateMatchCycle_remote();
				if (tournament.game_status === "In Progress" && tournament.current_match) {
					await startNewMatchCycle_remote(tournament);
				}
				localStorage.removeItem('right');
				localStorage.removeItem('left');
				urlRoute("/profile");
				errormsg("Your opponent disconnected, you won this match", "homepage-errormsg");
			}

      		if (data.only_player_disconnect) {}

		} catch (error) {
			hideModal("match-modal");
			if (error.message === "500" || error.message === "502") {
				urlRoute("/tournament-creation");
				errormsg(
					"Tournament could not be properly continued due to a server error",
					"homepage-errormsg"
				);
			} else if (error.message === "401") {
				urlRoute("/");
				errormsg("You were redirected to the landing page", "homepage-errormsg");
			} else if (error.message === "409") {
				urlRoute("/profile");
			} else {
				urlRoute("/profile");
				errormsg(error.message, "homepage-errormsg");
			}
		}
	};
}
