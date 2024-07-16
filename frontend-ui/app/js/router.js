import { error404 } from "./views/pages/error404.js";
import { homePage } from "./views/pages/home.js"
import { game } from "./views/pages/game.js"
import { newGame } from "./views/pages/newGame.js"
import { tournamentForm } from "./views/pages/tournamentForm.js"
import { tournamentHome } from "./views/pages/tournamentHome.js"
import { tournamentList } from "./views/pages/tournamentList.js"

const pageTitleBase = "Pong | ";

document.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('nav a')){
        return ;
	}
    event.preventDefault();
    handleRoute(event);
});

const pageTitle = " | Pong";

const routes = {
	404: {
		title: "Error 404" + pageTitle,
		description: "Page not found",
		renderContent: error404,
	},
	"/": {
		title: "Home" + pageTitle,
		description: "This is the home page",
		renderContent: homePage,
	},
	"/newgame": {
		title: "New Game" + pageTitle,
		description: "This is the new game page",
		renderContent: newGame,
	},
	"/tournament-home": {
		title: "Tournament Home" + pageTitle,
		description: "This is the tournament home page",
		renderContent: tournamentHome,
	},
	"/tournaments": {
		title: "Tournament List" + pageTitle,
		description: "This is the tournament list page",
		renderContent: tournamentList,
	},
	"/new-tournament": {
		title: "Create Tournament" + pageTitle,
		description: "This is the tournament creation form",
		renderContent: tournamentForm,
	},
	"/game": {
		title: "Game" + pageTitle,
		description: "This is the game page",
		renderContent: game,
	},
};

const handleRoute = (event) => {
	event = event || window.event;
	event.preventDefault();
	window.history.pushState({}, "", event.target.href);
	renderRouteView();
};

const renderRouteView = async () => {
	const path = window.location.pathname;
	if (path.length == 0) {
		path = "/";
	}
	const route = routes[path] || routes[404];
    const html = route.renderContent();
    document.getElementById("main-content").innerHTML = html;
};

window.onpopstate = renderRouteView;
window.route = handleRoute;

renderRouteView();