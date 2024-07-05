document.addEventListener('click', (e) => {
    const {target} = e;
    if (!target.matches('nav a'))
        return ;
    e.preventDefault();
    urlRoute(e);
})

const urlRoutes = {
    404 : {
        path: "/error",
        functionPath: "./partials/error404Page.js",
        templateFunction: "error404Page"
    },
    "/" : {
        path: "/",
        functionPath: "./partials/arrivalPage.js",
        templateFunction: "arrivalPage"
    },
    "/newgame" : {
        path: "/newgame",
        functionPath: "./partials/newGamePage.js",
        templateFunction: "newGamePage"
    },
    "/profile" : {
        path: "/profile",
        functionPath: "./partials/profilePage.js",
        templateFunction: "profilePage"
    },
    "/stats" : {
    path: "/stats",
    functionPath: "./partials/statsPage.js",
    templateFunction: "statsPage"
    }
}

const urlRoute = (event) => {
    event = event;
    event.preventDefault();
    window.history.pushState({}, '', event.target.href);
    urlLocationHandler();
}

const urlLocationHandler = async () => {
    const currentLocation = window.location.pathname;
    if (currentLocation.length == 0)
        currentLocation = "/";

    const route = urlRoutes[currentLocation];
    const module = await import(route.functionPath);
    const html = module[route.templateFunction]();
    const appDiv = document.getElementById('app');

    appDiv.innerHTML = html;
}

window.onpopstate = urlLocationHandler;
window.route = urlRoute;

urlLocationHandler();

