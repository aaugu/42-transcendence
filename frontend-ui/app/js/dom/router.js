import { signupPage } from "../pages/signup/signupPage.js"
import { signupEvent } from "../pages/signup/signupEvent.js"
import { error404Page } from "../pages/errorpage/error404Page.js"
import { gamePage } from "../pages/game/gamePage.js"
import { profilePage } from "../pages/profile/profilePage.js"
import { loginPage } from "../pages/login/loginPage.js"
import { loginEvent } from "../pages/login/loginEvent.js"
import { profileEvent } from "../pages/profile/profileEvent.js"
import { homePage } from "../pages/homePage.js"
import { chatPage } from "../pages/chat/chatPage.js"
import { userIsConnected } from "../pages/user/updateProfile.js"
import { startGame } from "../pages/game/gameplay/startGame.js"
import { tournamentPage } from "../pages/tournament/tournamentPage.js"
import { tournamentEvent } from "../pages/tournament/tournamentEvent.js"
import { socket } from "../pages/game/gameplay/startGame.js"
import { reset_all_tournaments } from "../pages/tournament/tournament.js"

let urlRoute;
let currentEventListener = null;

function updateEventListenerMainCont(newEventListener) {
	const mainCont = document.getElementById('main-content');
	if (currentEventListener !== null)
		mainCont.removeEventListener('click', currentEventListener);
	currentEventListener = newEventListener;
	if (currentEventListener !== null) {
		mainCont.addEventListener('click', currentEventListener);
	}
}

function resetDataRouteChange() {
	if (socket) {
		socket.close();
		console.log('GAME LOG: Websocket connection closed');
	}
	reset_all_tournaments();
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
        "/local-twoplayer" : {
			content: gamePage,
			eventListener: null,
			startFunction: startGame,
			description: "local two player game page"
		},
		"/local-ai" : {
			content: gamePage,
			eventListener: null,
			startFunction: startGame,
			description: "local IA game page"
		},
		"/remote-twoplayer" : {
			content: gamePage,
			eventListener: null,
			startFunction: startGame,
			description: "remote two player game page"
		},
		"/tournament" : {
			content: tournamentPage,
			eventListener: tournamentEvent,
			startFunction: startGame,
			description: "create or join tournament page"
		},
		"/tournament/game" : {
			content: gamePage,
			eventListener: null,
			startFunction: startGame,
			description: "tournament game page"
		},
        "/profile" : {
			content: profilePage,
			eventListener: profileEvent,
			description: "profile page"
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
		resetDataRouteChange();
        const currentRoute = window.location.pathname;
        if (currentRoute.length == 0)
			currentRoute = "/";

        const currentRouteDetails = urlRoutes[currentRoute] || urlRoutes[404];
        const html = await (currentRouteDetails.content)();
		updateEventListenerMainCont(currentRouteDetails.eventListener);

		const mainCont = document.getElementById('main-content');
        mainCont.innerHTML = html;
		if (currentRoute ==="/local-twoplayer" || currentRoute === "/local-ai" || currentRoute === "/remote-twoplayer") {
			currentRouteDetails.startFunction();
		}
	}

    window.onpopstate = goToRoute;
    window.route = urlRoute;

    goToRoute();

});

export {urlRoute}
