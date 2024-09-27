import { userID } from '../../user/updateProfile.js'
import { urlRoute } from '../../../dom/router.js';
import { errormsg } from '../../../dom/errormsg.js';

class TournamentUtils {
	constructor(tourn_id, game_status) {
        this.tourn_id = tourn_id;
        this.current_match = null;
        this.game_status = game_status; // 'Created', 'In Progress', 'Finished'
		this.all_matches = null;
		this.notif_link = null;
    }

	_nextMatch() {
		this.current_match = this.all_matches.find(match => match.status === "In Progress") ||
							this.all_matches.find(match => match.status === "Not Played") || null;
	}

	async startNextMatch() {
		this._nextMatch();
		if (!this.current_match) {
			this.game_status = 'Finished';
			return ;
		}
		if (this.current_match.status === "Not Played") {
			await this.startMatch();
		}
    }

	async _startTournament() {
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
		if (response.status == 500 || response.status == 502)
			throw new Error(`${response.status}`);
		const responseData = await response.json();
		if (!response.ok) {
			if (responseData.errors)
				throw new Error(`${responseData.errors}`);
			throw new Error(`${response.status}`);
		}
	}

	async _generateMatches(fetch_method) {
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
		if (response.status == 500 || response.status == 502)
			throw new Error(`${response.status}`);
		const responseData = await response.json();
		if (!response.ok) {
			if (responseData.errors)
				throw new Error(`${responseData.errors}`);
			throw new Error(`${response.status}`);
		}
		if (responseData !== null) {
			return responseData;
		}
	}

	async startMatch() {
		const url = 'https://localhost:10443/api/tournament/' + this.tourn_id + '/match/start/';
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				"player_1": this.current_match.player_1.user_id,
				"player_2": this.current_match.player_2.user_id,
				"link": this.notif_link
			}),
			credentials: 'include'
		});
		if (response.status == 500 || response.status == 502)
			throw new Error(`${response.status}`);
		const responseData = await response.json();
		if (!response.ok) {
			if (responseData.errors)
				throw new Error(`${responseData.errors}`);
			throw new Error(`${response.status}`);
		}
	}

	async endMatch(winner_id) {
		console.log("winner id in endMatch: ", winner_id);

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
		if (response.status == 500 || response.status == 502)
			throw new Error(`${response.status}`);
		const responseData = await response.json();
		if (!response.ok) {
			if (responseData.errors)
				throw new Error(`${responseData.errors}`);
			throw new Error(`${response.status}`);
		}
	}
}

export class Tournament extends TournamentUtils{

	constructor(tourn_id, game_status) {
        super(tourn_id, game_status);
    }

    async updateMatchCycle(winner_id) {
        try {
            await this.endMatch(winner_id);
            const response = await this._generateMatches('GET');

			this.all_matches = response.matches;
			this.startNextMatch();
        } catch (e) {
            // console.error(`TOURNAMENT LOG: ERROR UPDATING MATCHES: ${e.message}`);
            this.all_matches = null;
			if (e.message == '500' || e.message == '502') {
				throw new Error(`${e.message}`);
			}
        }
    }

    async launchTournament() {
        try {
			// console.log("TOURNAMENT LOG: Launch Tournament");
            const response = await this._generateMatches('POST');
            await this._startTournament();
			this.all_matches = response.matches;
            this.startNextMatch();
			this.game_status = 'In Progress';
    	}
		catch (e) {
			// console.error(`TOURNAMENT LOG: ERROR STARTING TOURNAMENT: ${e.message}`);
			this.all_matches = null;
			if (this.game_status !== 'Finished')
				this.game_status = 'Created';
			throw new Error(`${e.message}`);
		}
	}

	async continueTournament() {
        try {
			// console.log("TOURNAMENT LOG: Continue Tournament");
            const response = await this._generateMatches('GET');

			this.all_matches = response.matches;
			this._nextMatch();
    	}
		catch (e) {
			// console.error(`TOURNAMENT LOG: ERROR CONTINUING TOURNAMENT: ${e.message}`);
            this.all_matches = null;
			if (e.message == '500' || e.message == '502') {
				throw new Error('Tournament could not be properly continued due to a server error');
			}
		}
	}


}

export class RemoteTournament extends Tournament {
	constructor(tourn_id, game_status) {
		super(tourn_id, game_status);
	}

	async launchTournament_remote() {
        try {
			// console.log("TOURNAMENT LOG: Launch Tournament");
            const response = await this._generateMatches('POST');
            await this._startTournament();
			this.all_matches = response.matches;
			this._nextMatch();
			this.game_status = 'In Progress';
			// if (!this.current_match)
			// 	this.game_status = 'Finished';
    	}
		catch (e) {
			// console.error(`TOURNAMENT LOG: ERROR STARTING TOURNAMENT: ${e.message}`);
			this.all_matches = null;
			if (this.game_status !== 'Finished')
				this.game_status = 'Created';
			throw new Error(`${e.message}`);
		}
	}

	async updateMatchCycle_remote() {
        try {
            const response = await this._generateMatches('GET');
			this.all_matches = response.matches;
			this._nextMatch();
			if (!this.current_match)
				this.game_status = 'Finished';
        } catch (e) {
            // console.error(`TOURNAMENT LOG: ERROR UPDATING MATCHES: ${e.message}`);
            this.all_matches = null;
			if (e.message == '500' || e.message == '502') {
				throw new Error(`${e.message}`);
			}
        }
    }
}