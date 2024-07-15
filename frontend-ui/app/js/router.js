import { error404 } from "./views/pages/error404.js";
import { homePage } from "./views/pages/home.js"
import { tournamentHome } from "./views/pages/tournamentHome.js"
import { tournamentList } from "./views/pages/tournamentList.js"
import { game } from "./views/pages/game.js"

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
	"/game": {
		title: "Game" + pageTitle,
		description: "This is the game page",
		renderContent: game,
	},
	"/tournaments": {
		title: "Tournament List" + pageTitle,
		description: "This is the tournament list page",
		renderContent: tournamentList,
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
	const route = routes[path] || routes["404"];
    const html = route.renderContent();
    document.getElementById("content").innerHTML = html;
};

window.onpopstate = renderRouteView;
window.route = handleRoute;

renderRouteView();