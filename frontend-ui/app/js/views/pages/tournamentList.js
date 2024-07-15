export function tournamentList() {
	return `
    <h1 class="text-bold display-5">Tournament Home</h1>
    <row class="justify-content-center mt-5">
        <button type="submit" class="btn btn-light" id="tournaments" href="/tournaments">Join tournament</button>
        <button type="submit" class="btn btn-dark" id="new-tournament" href="/new-tournament">Create tournament</button>
    </row> 
    `;
}
