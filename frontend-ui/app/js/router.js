export default class Router {
	constructor(routes) {
		this.routes = routes;
		this._loadInitialRoute();
	}

	_loadInitialRoute() {
		this._navigateTo("/");
	}
	
	loadRoute = async () => {
		const path = this._getCurrentURL();
		window.history.pushState({}, '', path);
		this._navigateTo(path);
	}

	_getCurrentURL() {
		const path = window.location.pathname;
		return path;
	}
	
	_navigateTo(urlPath) {
		const matchedRoute = this._matchUrlToRoute(urlPath);
		matchedRoute.renderContent();
	}
	
	_matchUrlToRoute(path) {
		const matchedRoute = this.routes[path];
		if (!matchedRoute)
			return this.routes["404"];

		return matchedRoute;
	}
}