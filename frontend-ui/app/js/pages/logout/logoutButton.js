import { urlRoute } from "../../dom_js/router.js"

function unsetCookieSessionStorage() {
	// sessionStorage.clear('access_token');
	// sessionStorage.clear('refresh_token');

	sessionStorage.clear('access_token');
}

export async function logoutButton() {
    if (sessionStorage.getItem('access_token') !== null)
    {
        unsetCookieSessionStorage();
		// sessionStorage.removeItem('refresh_token');
        urlRoute('/');
    }
    else {
        console.log('user was not active');
        return;
    }
}
