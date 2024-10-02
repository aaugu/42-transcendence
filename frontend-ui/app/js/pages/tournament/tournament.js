import { getTournaments } from "./getTournaments.js";

export var all_tournaments = {};

export function reset_all_tournaments() {
    all_tournaments = {};
}

export async function get_all_tournaments() {
	try {
		const response = await getTournaments();
		all_tournaments = response.tournaments;
	}
	catch (e) {
		all_tournaments = {};
		throw new Error(`${e.message}`);
	}
}



