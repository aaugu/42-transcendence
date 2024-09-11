import { getTournaments } from "./getTournaments.js";

export var all_tournaments = {};

export function reset_all_tournaments() {
    all_tournaments = {};
}

export async function get_all_tournaments() {
	try {
		const response = await getTournaments();
		console.log('response: ', response);
		all_tournaments = response.tournaments;
		console.log("all_tournaments: ", all_tournaments);
	}
	catch (e) {
		console.error("USER LOG: ", e.message);
		all_tournaments = {};
	}
}

export function get_tournament_id(t_name) {
	const t_values = Object.values(all_tournaments);
	var t_id = null;
	t_values.forEach(tournament => {
        if (tournament.name === t_name) {
			t_id = tournament.id;
		}
    });
	return t_id;
}


