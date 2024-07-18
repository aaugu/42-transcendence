import { signupPage } from "../pages/signup/signupPage.js"
import { signupEvent } from "../pages/signup/signupEvent.js"
import { error404Page } from "../pages/errorpage/error404Page.js"
import { gamePage } from "../pages/game/gamePage.js"
import { profilePage } from "../pages/profile/profilePage.js"
import { statsPage } from "../pages/stats/statsPage.js"
import { loginPage } from "../pages/login/loginPage.js"
import { loginEvent } from "../pages/login/loginEvent.js"
import { logoutEvent } from "../pages/logout/logoutEvent.js"
import { homePage } from "../pages/homePage.js"

let urlRoute;
let currentEventListener = null;

function updateEventListenerMainCont(newEventListener) {
	const mainCont = document.getElementById('main-container');
	if (currentEventListener !== null)
			mainCont.removeEventListener('click', currentEventListener);
	currentEventListener = newEventListener;
	mainCont.addEventListener('click', currentEventListener);
}

document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('click', (e) => {
        const {target} = e;
        if (!target.matches('nav a') && !target.matches('row a'))
            return ;
        e.preventDefault();
        urlRoute(e);
    })

    const urlRoutes = {
        404 : {
			content: error404Page,
			eventListener: null,
			description: "error 404"
		},
        "/" : {
			content: homePage,
			eventListener: null,
			description: "Homepage"
		},
		"/login" : {
			content: loginPage,
			eventListener: loginEvent,
			description: "login page"
		},
        "/signup" : {
			content: signupPage,
			eventListener: signupEvent,
			description: "signup page"
		},
        "/game" : {
			content: gamePage,
			eventListener: null,
			description: "game page"
		},
        "/profile" : {
			content: profilePage,
			eventListener: null,
			description: "profile page"
		},
        "/stats" : {
			content: statsPage,
			eventListener: null,
			description: "stats page"
		},
		"/logout" : {
			content: homePage,
			eventListener: logoutEvent,
			description: "logout redirecting to homepage"
		}
    }

    urlRoute = (url) => {
        if (typeof url !== 'string')
        {
            const event = url;
            event.preventDefault();
            url = event.target.href;
        }
        window.history.pushState({}, '', url);
        goToRoute();
    }

    const goToRoute = async () => {
        const currentRoute = window.location.pathname;
        if (currentRoute.length == 0)
		currentRoute = "/";

        const currentRouteDetails = urlRoutes[currentRoute] || urlRoutes[404];
        const html = (currentRouteDetails.content)();
		updateEventListenerMainCont(currentRouteDetails.eventListener);

		const mainCont = document.getElementById('main-container');
        mainCont.innerHTML = html;
	}

    window.onpopstate = goToRoute;
    window.route = urlRoute;

    goToRoute();

});

export {urlRoute}
