import { urlRoute } from "../../dom/router.js"
import { userIsConnected } from "../user/user.js";

export async function loginProcess() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (userIsConnected(username, password) === null){
        return;
    }
    //send variables to microservice via API
    //handle case if user is already logged in
    const sendLoginDataToAPI = async (username, password) => {
    // await fetch('https://172.20.0.2/api/login/', {
    //     method: 'POST',
    //     headers: {
    //         'Accept': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         "username": username,
    //         "password": password
    //     )},
    // })
    // .then(response => {
    //         if (!response.ok) //analyze error code or body
    //             throw new Error(`HTTP status code ${response.status}`);
    //         return response.json()
    // })
    // .then(responseData => {
    //         if (data !== null) {
                // set access token in httponly cookies
    //             console.log(JSON.stringify(responseData))
    //             // urlRoute("/profile");
    //         }
    // })
    // .catch(e => console.error('Fetch error: '+ e));
    }

    await sendLoginDataToAPI(username, password);

    sessionStorage.setItem('access_token', username);
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
