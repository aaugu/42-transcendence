import Router from "./router.js"
import { getHomePage } from "./pages/homePage.js"
import { getTournaments } from "./pages/tournaments.js"
import { error404 } from "./pages/error404.js";

const urlPageTitle = "Pong";

const routes = {
    "404": {
        title: urlPageTitle + " | 404",
        description: "Page not found",
        renderContent: error404,
    },
    "/": {
        title: urlPageTitle + " | Home page",
        description: "This is the home page",
        renderContent: getHomePage,
    },
    "/tournaments": {
        title: urlPageTitle + " | Tournaments",
        description: "This is the tournament page",
        renderContent: getTournaments,
    },
}

const router = new Router(routes)

document.addEventListener("click", (event) => {
	const { target } = event;
	if (!target.matches("nav a")) {
		return;
	}

	event.preventDefault();
    event = event || window.event;
    event.preventDefault();

	router.loadRoute();
});

window.onpopstate = router.loadRoute;
window.route = routes;