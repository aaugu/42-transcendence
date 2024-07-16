import { urlRoute } from "./router.js"
import { user_is_active } from "./user.js";

export async function logoutButton() {
    if (user_is_active === true)
    {
        localStorage.removeItem('access_token');
		// localStorage.removeItem('refresh_token');
        urlRoute('/');
    }
    else {
        console.log('user was not active');
        return;
    }
}
