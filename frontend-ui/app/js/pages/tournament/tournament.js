import { getTournaments } from "./getTournaments.js";

export var all_tournaments = {};

export function reset_all_tournaments() {
    all_tournaments = {};
}

export async function get_all_tournaments() {
	// all_tournaments = {
    //     "first_tournament": {
    //         "name": "first tournament",
    //         "id": 1,
	// 		"players" : {
	// 			"player1": {
	// 				"user-id": 1,
	// 				"nickname": "player1"
	// 			},
	// 			"player2": {
	// 				"user-id": 2,
	// 				"nickname": "player2"
	// 			}
	// 		}
    //     },
    //     "second_tournament": {
    //         "name": "second tournament",
    //         "id": 2
    //     }
    // };
	try {
		all_tournaments = await getTournaments();
		console.log("all_tournaments: ", all_tournaments);
	}
	catch (e) {
		console.error("USER LOG: ", e.message);
		all_tournaments = {};
	}
}

export function get_tournament_id(t_name) {
	console.log("t_name: ", t_name);
	const t_values = Object.values(all_tournaments);
	console.log("t_values: ", t_values);
	var t_id = null;
	t_values.forEach(tournament => {
        if (tournament.name === t_name) {
			t_id = tournament.id;
		}
    });
	return t_id;
}


