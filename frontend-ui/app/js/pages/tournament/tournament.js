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
		console.error("USER LOG: ", e.message);
		all_tournaments = {};
		if (e.message === "500" || e.message === "502") {
			throw new Error(`${e.message}`);
		}
	}
}



