import { urlRoute } from "./router.js"
import { user_is_active } from "./user.js";
import { errormsg } from "./utils.js"

export async function loginButton() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (user_is_active === true)
    {
        errormsg("You are already logged in");
        return;
    }
    //send variables to microservice via API
    /*
        try/catch is used to get errors when the promise gets rejected (network or CORS issues)
        response.ok is used to handle server errors (404 or 500, for example) when the promise gets resolved
    */
    // await fetch('https://172.20.0.2/api/login/', {
    //     method: 'GET',
    //     headers: {
    //         'Accept': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         "username": username,
    //         "password": password
    //     })
    // })
    // .then(response => {
    //         if (!response.ok) //analyze error code or body
    //             throw new Error(`HTTP status code ${response.status}`);        
    //         return response.json()
    // })
    // .then(responseData => {
    //         if (data !== null) {
    //             console.log(JSON.stringify(responseData))
    //             // urlRoute("/profile");
    //         }
    // })
    // .catch(e => console.error('Fetch error: '+ e));

    //clear fields if error occurs



    urlRoute("/profile");
}


/*
    JSON format user signup:
    https://172.20.0.2/api/user/
    {
        "username": "",
        "nickname": "",
        "email": "",
        "password": ""
    }
    JSON format 2fa verification:
    https://172.20.0.2/api/token/verify-2fa/
    {
        "verification_code": "" 
    }
*/
