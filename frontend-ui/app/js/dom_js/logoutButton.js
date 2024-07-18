import { urlRoute } from "./router.js"
import { user_is_active } from "./user.js";

export async function logoutButton() {
    if (user_is_active === true)
    {
        localStorage.removeItem('user_is_active');
        urlRoute('/');
    }
    else {
        console.log('user was not active');
        return;
    }
}
