import {arrivalPage} from "../html/arrivalPage.js"
import {error404Page} from "../html/error404Page.js"
import {newGamePage} from "../html/newGamePage.js"
import {profilePage} from "../html/profilePage.js"
import {statsPage} from "../html/statsPage.js"

let urlRoute;

document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('click', (e) => {
        const {target} = e;
        if (!target.matches('nav a'))
            return ;
        e.preventDefault();
        urlRoute(e);
    })

    const urlRoutes = {
        404 : error404Page,
        "/" : arrivalPage,
        "/newgame" : newGamePage,
        "/profile" : profilePage,
        "/stats" : statsPage
    }

    urlRoute = (url) => {
        const event = url;
        event.preventDefault();
        window.history.pushState({}, '', event.target.href);
        goToRoute();
    }

    const goToRoute = async () => {
        const currentLocation = window.location.pathname;
        if (currentLocation.length == 0)
            currentLocation = "/";

        const routeFunction = urlRoutes[currentLocation] || urlRoutes[404];
        const html = routeFunction();
        const appDiv = document.getElementById('main-container');

        appDiv.innerHTML = html;
    }

    window.onpopstate = goToRoute;
    window.route = urlRoute;

    goToRoute();

});

export {urlRoute}

