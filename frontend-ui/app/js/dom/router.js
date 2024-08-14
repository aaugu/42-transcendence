import { signupPage } from "../pages/signup/signupPage.js"
import { signupEvent } from "../pages/signup/signupEvent.js"
import { error404Page } from "../pages/errorpage/error404Page.js"
import { twoPlayerGamePage } from "../pages/game/twoPlayerGamePage.js"
import { profilePage } from "../pages/profile/profilePage.js"
import { statsPage } from "../pages/stats/statsPage.js"
import { loginPage } from "../pages/login/loginPage.js"
import { loginEvent } from "../pages/login/loginEvent.js"
import { profileEvent } from "../pages/profile/profileEvent.js"
import { homePage } from "../pages/homePage.js"
import { chatPage } from "../pages/chat/chatPage.js"
import { userIsConnected } from "../pages/user/updateProfile.js"
import { mainGame } from "../pages/game/gameplay/mainGame.js"
import { twoFactorAuthPage } from "../pages/login/twoFactorAuthPage.js"
import { twoFactorAuthEvent } from "../pages/login/twoFactorAuthEvent.js"

let urlRoute;
let currentEventListener = null;

function updateEventListenerMainCont(newEventListener) {
	const mainCont = document.getElementById('main-content');
	if (currentEventListener !== null)
			mainCont.removeEventListener('click', currentEventListener);
	currentEventListener = newEventListener;
	if (currentEventListener !== null)
		mainCont.addEventListener('click', currentEventListener);
}

document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('click', (e) => {
        const {target} = e;
        if (!target.matches('nav a, #login, #signup'))
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
		"/twoFA" : {
			content: twoFactorAuthPage,
			eventListener: twoFactorAuthEvent,
			description: "two factor authentication page"
		},
        "/newgame" : {
			content: twoPlayerGamePage,
			eventListener: mainGame,
			description: "new game page"
		},
        "/profile" : {
			content: profilePage,
			eventListener: profileEvent,
			description: "profile page"
		},
        "/stats" : {
			content: statsPage,
			eventListener: null,
			description: "stats page"
		},
		"/chat" : {
			content: chatPage,
			eventListener: null,
			description: "stats page"
		},
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

		const mainCont = document.getElementById('main-content');
        mainCont.innerHTML = html;
	}

    window.onpopstate = goToRoute;
    window.route = urlRoute;

    goToRoute();

});

export {urlRoute}
