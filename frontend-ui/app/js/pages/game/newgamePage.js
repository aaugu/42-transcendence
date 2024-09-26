export function newgamePage() {
    document.getElementById('nav-profile-elements').classList.remove('hidden');
	document.getElementById('logo').href = "/profile";
    return `
    <h1 class="text-bold display-3">Click for a new game</h1>
	<div id="error-500-text"></div>
    `;
}