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
import { startGame } from "../pages/game/gameplay/startGame.js"
import { startGameTournament, t_socket } from "../pages/game/gameplay-tournament/startGameTournament.js"
import { tournamentPage } from "../pages/tournament/tournamentPage.js"
import { tournamentEvent } from "../pages/tournament/tournamentEvent.js"
import { g_socket } from "../pages/game/gameplay/startGame.js"
import { reset_all_tournaments } from "../pages/tournament/tournament.js"
import { reset_all_conv } from "../pages/livechat/conversations.js"
import { updateConvList } from "../pages/livechat/updateConvList.js"
import { startFriendListRefresh, clearFriendList } from "../pages/profile/friends.js"
import { livechatPage } from "../pages/livechat/livechatPage.js"
import { livechatEvent } from "../pages/livechat/livechatEvent.js"
import { updateTournLists } from "../pages/tournament/updateTournLists.js"
import { joinGamePage } from "../pages/game/joinGamePage.js";
import { joinGameEvent } from "../pages/game/connection/joinGameEvent.js";

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
	if (g_socket) {
		g_socket.close();
		console.log('GAME LOG: Websocket connection closed');
	}
	if (t_socket) {
		t_socket.close();
		console.log('GAME LOG: Websocket connection closed');
	}
	reset_all_tournaments();
	reset_all_conv();
	clearFriendList();
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
			content: gamePage,
			startFunction: startGame,
			description: "local two player game page"
		},
		"/local-ai" : {
			content: gamePage,
			startFunction: startGame,
			description: "local IA game page"
		},
		"/remote-twoplayer" : {
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
		"/tournament" : {
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
			startFunction: updateConvList,
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

	//add in the end: || ((currentRoute !== "/" && currentRoute !== "/login" && currentRoute !== "/signup") && userIsConnected === false)
    const goToRoute = async () => {
		resetDataRouteChange();
		setUserID();
        var currentRoute = window.location.pathname;
        if (currentRoute.length == 0 ) {
			currentRoute = "/";
			window.history.pushState({}, '', currentRoute);
		}
        const currentRouteDetails = urlRoutes[currentRoute] || urlRoutes[404];
        const html = await (currentRouteDetails.content)();
		if (currentRouteDetails.eventListener) {
			updateEventListenerMainCont(currentRouteDetails.eventListener);
		}
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
