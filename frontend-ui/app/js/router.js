import { error404 } from "./renders/pages/error404.js";
import { homePage } from "./renders/pages/home.js"
import { newGame } from "./renders/pages/newGame.js"
import { tournamentHome } from "./renders/pages/tournamentHome.js"

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
	}
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