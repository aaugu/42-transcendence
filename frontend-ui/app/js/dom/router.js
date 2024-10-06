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
import { startGameTwoPlayers,  g_socket } from "../pages/game/gameplay/startGameTwoPlayers.js"
import { startGameTournamentlocal, t_socket } from "../pages/game/gameplay-tournament/startGameTournamentlocal.js"
import { tournamentPage } from "../pages/tournament/tournamentPage.js"
import { tournamentEvent } from "../pages/tournament/tournamentEvent.js"
import { reset_all_tournaments } from "../pages/tournament/tournament.js"
import { reset_all_conv } from "../pages/livechat/conversations.js"
import { startFriendListRefresh, clearFriendListRefresh } from "../pages/profile/friends.js"
import { chatSocket} from "../pages/livechat/startLivechat.js"
import { livechatPage } from "../pages/livechat/livechatPage.js"
import { livechatEvent } from "../pages/livechat/livechatEvent.js"
import { updateTournLists } from "../pages/tournament/updateTournLists.js"
import { newgamePage } from "../pages/game/newgamePage.js"
import { newlocalgameEvent } from "../pages/game/newgameEvent.js"
import { notifications, clearNotificationsRefresh } from "../pages/livechat/notifications.js"
import { publicProfilePage } from "../pages/profile/publicProfilePage.js"
import { startGameTournamentremote, t_remote_socket } from "../pages/game/gameplay-tournament/startGameTournamentremote.js"
import { keyUpEventTwoPlayer, keyDownEventTwoPlayer } from "../pages/game/gameplay/startGameTwoPlayers.js"
import { keyUpEventTournamentLocal, keyDownEventTournamentLocal } from "../pages/game/gameplay-tournament/startGameTournamentlocal.js"
import { keyDownEventTournamentRemote, keyUpEventTournamentRemote } from "../pages/game/gameplay-tournament/startGameTournamentremote.js"
import { loginSubmitOnEnter } from "../pages/login/loginEvent.js"
import { signupSubmitOnEnter } from "../pages/signup/signupEvent.js"

let urlRoute;
let currentClickListener = null;
let currentKeyupListener = null;
let currentKeydownListener = null;

function updateEventListeners(newClickListener = null, newKeyupListener = null, newKeydownListener = null) {
	const mainCont = document.getElementById('main-content');
	if (currentClickListener !== null) {
		mainCont.removeEventListener('click', currentClickListener);
	}
	currentClickListener = newClickListener;
	if (currentClickListener !== null) {
		mainCont.addEventListener('click', currentClickListener);
	}

	if (currentKeyupListener !== null) {
		document.removeEventListener('keyup', currentKeyupListener);
	}
	currentKeyupListener = newKeyupListener;

	if (currentKeydownListener !== null) {
		document.removeEventListener('keydown', currentKeydownListener);
	}
	currentKeydownListener = newKeydownListener;
}

function resetDataRouteChange() {
	if (g_socket && g_socket.readyState === WebSocket.OPEN) {
		g_socket.close();
	}
	if (t_socket && t_socket.readyState === WebSocket.OPEN) {
		t_socket.close();
	}
	if (chatSocket && chatSocket.readyState == WebSocket.OPEN) {
		chatSocket.close();
	}
	if (t_remote_socket && t_remote_socket.readyState == WebSocket.OPEN) {
		t_remote_socket.close();
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
			clickListener: loginEvent,
			keydown: loginSubmitOnEnter,
			description: "login page"
		},
        "/signup" : {
			content: signupPage,
			clickListener: signupEvent,
			keydown: signupSubmitOnEnter,
			description: "signup page"
		},
        "/local-twoplayer" : {
			content: newgamePage,
			clickListener: newlocalgameEvent,
			description: "local two player game page"
		},
		"/local-twoplayer/:gameId" : {
			content: gamePage,
			startFunction: startGameTwoPlayers,
			keyup: keyUpEventTwoPlayer,
			keydown: keyDownEventTwoPlayer,
			description: "local two player game page"
		},
		"/remote-twoplayer/:gameId" : {
			content: gamePage,
			startFunction: startGameTwoPlayers,
			keyup: keyUpEventTwoPlayer,
			keydown: keyDownEventTwoPlayer,
			description: "remote two player game page"
		},
		"/tournament-creation" : {
			content: tournamentPage,
			clickListener: tournamentEvent,
			startFunction: updateTournLists,
			description: "create or join tournament page"
		},
		"/tournament/:gameId" : {
			content: gamePage,
			startFunction: startGameTournamentlocal,
			keyup: keyUpEventTournamentLocal,
			keydown: keyDownEventTournamentLocal,
			description: "local tournament game page"
		},
		"/tournament-remote/:gameId" : {
			content: gamePage,
			startFunction: startGameTournamentremote,
			keyup: keyUpEventTournamentRemote,
			keydown: keyDownEventTournamentRemote,
			description: "remote tournament game page"
		},
        "/profile" : {
			content: profilePage,
			clickListener: profileEvent,
			startFunction: startFriendListRefresh,
			description: "profile page"
		},
		"/profile/:id" : {
			content: publicProfilePage,
			description: "someone else's profile page"
		},
		"/livechat" : {
			content: livechatPage,
			clickListener: livechatEvent,
			startFunction: notifications,
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
		setUserID();
        var currentRoute = window.location.pathname;
        if (currentRoute.length == 0) {
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

		updateEventListeners(currentRouteDetails.clickListener, currentRouteDetails.keyup, currentRouteDetails.keydown);

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
