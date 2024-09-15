import  updateGameState  from "./GameDraw.js";
import { Tournament } from "../gameplay-tournament/tournamentClass.js";

export function handleWebsocketGame(socket, canvas) {

	socket.onopen = function(event) {
		console.log("WebSocket connection opened:", event);
	};

	socket.onclose = function(event) {
		console.log("WebSocket connection closed:", event);
	};

	socket.onerror = function(error) {
		console.error("WebSocket error:", error);
	};

	socket.onmessage = function (event) {
		// console.log("Raw message received:", event.data);
		try {
			const data = JSON.parse(event.data);
			// console.log("Parsed data:", data);

			if (data.game_state) {
				// console.log("Game State", data.game_state);
				updateGameState(data.game_state, canvas);
			}

			if (data.game_finished) {
				console.log("Game Finished", data.game_finished);
				console.log("WinnerID", data.winner_id);
				console.log("LoserID", data.loser_id);
			}
		} catch (error) {
			console.error("Error parsing message:", error);
			console.log("Raw message that caused error:", event.data);
		}
	};
}

export function handleWebsocketTournament(socket, tournament) {
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
	};

	socket.onmessage = function (event) {
		// console.log("Raw message received:", event.data);
		try {
			const data = JSON.parse(event.data);
			// console.log("Parsed data:", data);

			if (data.game_state) {
				// console.log("Game State", data.game_state);
				updateGameState(data.game_state, canvas);
			}

			if (data.game_finished) {
				console.log("Game Finished", data.game_finished);
				console.log("WinnerID", data.winner_id);
				console.log("LoserID", data.loser_id);
				const winner = (data.winner_id === 1) ? current_match.player_1 : current_match.player_2

				tournament.updateMatchCycle(winner.id);
				if (tournament.game_status === 1) {
					const t_matchmodal = new bootstrap.Modal(document.getElementById('t-match-modal'));
					document.getElementById("t-match-text").innerText = `The winner is: ${winner.nickname}. Next match: ${tournament.current_match.player_1.nickname} vs ${tournament.current_match.player_2.nickname}`;
					document.getElementById("t-match-go").onclick = async function() {
						//reset game state and start next match
						//hide modal
					};
					t_matchmodal.show();
				}
				//si c'est null == fin du tournament
			}
		} catch (error) {
			console.error("Error parsing message:", error);
			console.log("Raw message that caused error:", event.data);
		}
	};

}