import { signupPage } from "../pages/signup/signupPage.js"
import { signupEvent } from "../pages/signup/signupEvent.js"
import { error404Page } from "../pages/errorpage/error404Page.js"
import { gamePage } from "../pages/game/gamePage.js"
import { profilePage } from "../pages/profile/profilePage.js"
import { loginPage } from "../pages/login/loginPage.js"
import { loginEvent } from "../pages/login/loginEvent.js"
import { profileEvent } from "../pages/profile/profileEvent.js"
import { homePage } from "../pages/homePage.js"
import { setUserID } from "../pages/user/updateProfile.js"
import { startGame,  g_socket } from "../pages/game/gameplay/startGame.js"
import { startGameTournament, t_socket } from "../pages/game/gameplay-tournament/startGameTournament.js"
import { tournamentPage } from "../pages/tournament/tournamentPage.js"
import { tournamentEvent } from "../pages/tournament/tournamentEvent.js"
import { reset_all_tournaments } from "../pages/tournament/tournament.js"
import { reset_all_conv } from "../pages/livechat/conversations.js"
import { startFriendListRefresh, clearFriendListRefresh } from "../pages/profile/friends.js"
import { chatSocket} from "../pages/livechat/startLivechat.js"
import { livechatPage } from "../pages/livechat/livechatPage.js"
import { livechatEvent } from "../pages/livechat/livechatEvent.js"
import { updateTournLists } from "../pages/tournament/updateTournLists.js"
import { joinGamePage } from "../pages/game/remote/joinGamePage.js"
import { joinGameEvent } from "../pages/game/remote/joinGameEvent.js"
import { newgamePage } from "../pages/game/newgamePage.js"
import { newlocalgameEvent, newremotegameEvent, newAIgameEvent } from "../pages/game/newgameEvent.js"
import { notifications, clearNotificationsRefresh } from "../pages/livechat/notifications.js"

let urlRoute;
let currentEventListener = null;

function updateEventListenerMainCont(newEventListener = null) {
	const mainCont = document.getElementById('main-content');
	if (currentEventListener !== null) {
		mainCont.removeEventListener('click', currentEventListener);
	}
	currentEventListener = newEventListener;
	if (currentEventListener !== null) {
		mainCont.addEventListener('click', currentEventListener);
	}
}

function resetDataRouteChange() {
	if (g_socket && g_socket.readyState === WebSocket.OPEN) {
		g_socket.close();
		console.log('GAME LOG: Websocket connection closed');
	}
	if (t_socket && t_socket.readyState === WebSocket.OPEN) {
		t_socket.close();
		console.log('GAME LOG: Websocket connection closed');
	}
	if (chatSocket) {
		if (chatSocket.readyState == 1) {
			chatSocket.close();
		}
	}
	reset_all_tournaments();
	reset_all_conv();
	clearFriendListRefresh();
	clearNotificationsRefresh();
}

function matchRoute(route, path) {
    const routeParts = route.split('/');
    const pathParts = path.split('/');

    if (routeParts.length !== pathParts.length) {
        return null;
    }

    const params = {};
    const matched = routeParts.every((part, i) => {
        if (part.startsWith(':')) {
            params[part.slice(1)] = pathParts[i];
            return true;
        }
        return part === pathParts[i];
    });

    return matched ? { route, params } : null;
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
			description: "error 404"
		},
        "/" : {
			content: homePage,
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
			content: newgamePage,
			eventListener: newlocalgameEvent,
			description: "local two player game page"
		},
		"/local-twoplayer/:gameId" : {
			content: gamePage,
			startFunction: startGame,
			description: "local two player game page"
		},
		"/local-ai" : {
			content: newgamePage,
			startFunction: newAIgameEvent,
			description: "local IA game page"
		},
		"/local-ai/:gameId" : {
			content: gamePage,
			startFunction: startGame,
			description: "local IA game page"
		},
		"/remote-twoplayer" : {
			content: newgamePage,
			eventListener: newremotegameEvent,
			description: "remote two player game page"
		},
		"/remote-twoplayer/:gameId" : {
			content: gamePage,
			startFunction: startGame,
			description: "remote two player game page"
		},
		"/tournament-creation" : {
			content: tournamentPage,
			eventListener: tournamentEvent,
			startFunction: updateTournLists,
			description: "create or join tournament page"
		},
		"/tournament/:tournId" : {
			content: gamePage,
			startFunction: startGameTournament,
			description: "local tournament game page"
		},
		"/tournament-remote" : {
			content: gamePage,
			startFunction: startGameTournament,
			description: "remote tournament game page"
		},
        "/profile" : {
			content: profilePage,
			eventListener: profileEvent,
			startFunction: startFriendListRefresh,
			description: "profile page"
		},
		"/livechat" : {
			content: livechatPage,
			eventListener: livechatEvent,
			startFunction: notifications,
			description: "stats page"
		},
		"/join-game": {
			content: joinGamePage,
			eventListener: joinGameEvent,
			description: "join an existing game",
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

	//add in the end: || ((currentRoute !== "/" && currentRoute !== "/login" && currentRoute !== "/signup") && userID !== null)
    const goToRoute = async () => {
		resetDataRouteChange();
		setUserID();
        var currentRoute = window.location.pathname;
        if (currentRoute.length == 0 ) {
			currentRoute = "/";
			window.history.pushState({}, '', currentRoute);
		}

		let matchedRoute = null;
        let routeParams = {};

        for (let route in urlRoutes) {
            const match = matchRoute(route, currentRoute);
            if (match) {
                matchedRoute = urlRoutes[route];
                routeParams = match.params;
                break;
            }
        }

        const currentRouteDetails = matchedRoute || urlRoutes[404];
        const html = await (currentRouteDetails.content)();

		updateEventListenerMainCont(currentRouteDetails.eventListener);

		const mainCont = document.getElementById('main-content');
        mainCont.innerHTML = html;
		if (currentRouteDetails.startFunction) {
			currentRouteDetails.startFunction();
		}
	}

    window.onpopstate = goToRoute;
    window.route = urlRoute;

    goToRoute();

});

export {urlRoute}
