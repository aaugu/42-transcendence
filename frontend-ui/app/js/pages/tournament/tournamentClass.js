import { userID } from '../user/updateProfile.js'

export class Tournament {

	constructor(tourn_id) {
        this.tourn_id = tourn_id;
        this.current_match = null;
        this.game_status = 0; // 0: not started, 1: in progress, 2: finished
		this.all_matches = null;
		this.userID = userID;
    }

	nextMatch() {
		this.current_match = this.all_matches.find(match => match.status === "Not played");
	}

    // Update match list after a match has been completed
    async updateMatchCycle(winner_id) {
        try {
            await this.endMatch(winner_id); // End the match with winner_id
            const response = await this.generateMatches('GET'); // Fetch updated matches
			this.all_matches = response.matches; // Update the match list
			this.startNextMatch();
        } catch (e) {
            console.error(`TOURNAMENT LOG: ERROR UPDATING MATCHES: ${e.message}`);
            this.all_matches = null;
        }
    }

	async startNextMatch() {
		try {
			if (!this.all_matches)
				throw new Error('No matches available');
			this.nextMatch(all_matches);
			await this.startMatch(this.current_match.id);
		} catch (e) {
			console.error(`TOURNAMENT LOG: ERROR STARTING MATCH: ${e.message}`);
		}
    }

	// Launch the tournament and initialize the matches
    async launchTournament() {
        try {
            const response = await this.generateMatches('POST'); // Create and fetch initial matches
            await this.startTournament(); // Mark tournament as started
			this.all_matches = response.matches; // Set the match list
            this.startNextMatch();
			this.game_status = 1;
    	}
		catch (e) {
			console.error(`TOURNAMENT LOG: ERROR STARTING TOURNAMENT: ${e.message}`);
			this.all_matches = null;
		}
	}

    // Backend fetch for starting the tournament
    async startTournament() {
		const url = 'https://localhost:10444/api/tournament/' + this.tourn_id + '/start/';
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

	async generateMatches(fetch_method) {
		if (fetch_method === undefined || (fetch_method !== 'GET' && fetch_method !== 'POST')) {
			throw new Error('Invalid fetch method');
		}

		const url = 'https://localhost:10444/api/tournament/' + this.tourn_id + '/matches/generate/';
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

	async startMatch() {
		const url = 'https://localhost:10444/api/tournament/' + this.tourn_id + '/match/start/';
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				"player1": this.current_match.player1.id,
				"player2": this.current_match.player2.id
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

	async endMatch(winner_id) {
		if (this.tourn_id === undefined || winner_id === undefined) {
			throw new Error('Invalid parameters to end match');
		}

		const url = 'https://localhost:10444/api/tournament/' + this.tourn_id + '/match/end/';
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