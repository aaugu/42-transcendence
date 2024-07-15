import { signupPage } from "../html/signUpPage.js"
import { error404Page } from "../html/error404Page.js"
import { gamePage } from "../html/gamePage.js"
import { profilePage } from "../html/profilePage.js"
import { statsPage } from "../html/statsPage.js"
import { loginPage } from "../html/logInPage.js"
import { homePage } from "../html/homePage.js"

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
        "/" : homePage,
        "/login" : loginPage,
        "/signup" : signupPage,
        "/game" : gamePage,
        "/profile" : profilePage,
        "/stats" : statsPage
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
        const currentLocation = window.location.pathname;
        if (currentLocation.length == 0)
            currentLocation = "/";

        const routeFunction = urlRoutes[currentLocation] || urlRoutes[404];
        const html = routeFunction();
        const mainCont = document.getElementById('main-container');

        mainCont.innerHTML = html;
    }

    window.onpopstate = goToRoute;
    window.route = urlRoute; 

    goToRoute();

});

export {urlRoute}

