import { urlRoute } from "../../dom/router.js"

export async function logoutProcess() {
    if (sessionStorage.getItem('access_token') !== null)
    {
        sessionStorage.removeItem('access_token');
        console.log('being logged out');
        urlRoute('/');
    }
    else {
        console.log('user was not active');
    }
}
