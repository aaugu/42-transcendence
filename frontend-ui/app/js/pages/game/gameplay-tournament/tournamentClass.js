import { userID } from '../../user/updateProfile.js'
import { urlRoute } from '../../../dom/router.js';
import { errormsg } from '../../../dom/errormsg.js';

export class Tournament {

	constructor(tourn_id, game_status) {
        this.tourn_id = tourn_id;
        this.current_match = null;
        this.game_status = game_status; // 'Created', 'In Progress', 'Finished'
		this.all_matches = null;
		this.userID = userID;
    }

	#nextMatch() {
		this.current_match = this.all_matches.find(match => match.status === "In Progress") ||
							this.all_matches.find(match => match.status === "Not played");
	}

    // Update match list after a match has been completed
    async updateMatchCycle(winner_id) {
        try {
            await this.#endMatch(winner_id);
            const response = await this.#generateMatches('GET');

			this.all_matches = response.matches;
			this.#startNextMatch();
        } catch (e) {
            console.error(`TOURNAMENT LOG: ERROR UPDATING MATCHES: ${e.message}`);
            this.all_matches = null;
        }
    }

	async #startNextMatch() {
		if (!this.all_matches)
			throw new Error('No matches available');
		this.#nextMatch();
		if (this.current_match.status === "Not played") {
			await this.#startMatch();
		}
    }

    async launchTournament() {
        try {
			console.log("TOURNAMENT LOG: Launch Tournament");
            const response = await this.#generateMatches('POST');
            await this.#startTournament();
			this.all_matches = response.matches;
            this.#startNextMatch();
			this.game_status = 'In Progress';
    	}
		catch (e) {
			console.error(`TOURNAMENT LOG: ERROR STARTING TOURNAMENT: ${e.message}`);
			this.all_matches = null;
			if (this.game_status !== 'Finished')
				this.game_status = 'Created';
			urlRoute("/tournament-creation");
			errormsg(e.message, "homepage-errormsg");
		}
	}

	async continueTournament() {
        try {
			console.log("TOURNAMENT LOG: Continue Tournament");
            const response = await this.#generateMatches('GET');
			//check if status === finished

			this.all_matches = response.matches;
			this.#startNextMatch();
    	}
		catch (e) {
			console.error(`TOURNAMENT LOG: ERROR UPDATING MATCHES: ${e.message}`);
            this.all_matches = null;
		}
	}

    async #startTournament() {
		const url = 'https://localhost:10443/api/tournament/' + this.tourn_id + '/start/';
		const response = await fetch(url, {
			method: 'PATCH',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				"user_id": userID
			}),
			credentials: 'include'
		});
		const responseData = await response.json();
		if (!response.ok) {
			if (responseData.errors)
				throw new Error(`${responseData.errors}`);
			throw new Error(`${response.status}`);
		}
		if (responseData !== null) {
			console.log(`TOURNAMENT LOG: ${responseData.message}`);
		} else {
			throw new Error('No response from server');
		}
	}

	async #generateMatches(fetch_method) {
		if (fetch_method === undefined || (fetch_method !== 'GET' && fetch_method !== 'POST')) {
			throw new Error('Invalid fetch method');
		}

		const url = 'https://localhost:10443/api/tournament/' + this.tourn_id + '/matches/generate/';
		const response = await fetch(url, {
			method: fetch_method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include'
		});
		const responseData = await response.json();
		if (!response.ok) {
			if (responseData.errors)
				throw new Error(`${responseData.errors}`);
			throw new Error(`${response.status}`);
		}
		if (responseData !== null) {
			console.log('TOURNAMENT LOG: GENERATE MATCHES SUCCESSFUL');
			return responseData;
		} else {
			throw new Error('No response from server');
		}
	}

	async #startMatch() {
		const url = 'https://localhost:10443/api/tournament/' + this.tourn_id + '/match/start/';
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				"player_1": this.current_match.player_1.user_id,
				"player_2": this.current_match.player_2.user_id
			}),
			credentials: 'include'
		});
		const responseData = await response.json();
		if (!response.ok) {
			if (responseData.errors)
				throw new Error(`${responseData.errors}`);
			throw new Error(`${response.status}`);
		}
		if (responseData !== null) {
			console.log('TOURNAMENT LOG: START TOURNAMENT SUCCESSFUL');
		} else {
			throw new Error('No response from server');
		}
	}

	async #endMatch(winner_id) {
		if (this.tourn_id === undefined || winner_id === undefined) {
			throw new Error('Invalid parameters to end match');
		}

		const url = 'https://localhost:10443/api/tournament/' + this.tourn_id + '/match/end/';
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				"winner": winner_id
			}),
			credentials: 'include'
		});
		const responseData = await response.json();
		if (!response.ok) {
			if (responseData.errors)
				throw new Error(`${responseData.errors}`);
			throw new Error(`${response.status}`);
		}
		if (responseData !== null) {
			console.log('TOURNAMENT LOG: END MATCH SUCCESSFUL');
		} else {
			throw new Error('No response from server');
		}
	}
}