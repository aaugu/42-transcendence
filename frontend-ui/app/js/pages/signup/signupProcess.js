import { urlRoute } from "../../dom/router.js"
import { errormsg } from "../../dom/errormsg.js"

function signUpFieldsValidity(username, nickname, email, password, repeatPassword)
{
    if (username == '' || nickname == '' || email == '' || password == '' || repeatPassword == '') {
        errormsg("All fields must be filled out");
        return false;
    }
    else if (password !== repeatPassword) {
        errormsg("The passwords don't match");
        return false;
    }
    const emailValidity = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    if (emailValidity == false) {
        errormsg("Enter a valid email");
        return false;
    }
    const passwordValidity = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLongEnough = password.length >= 8 && password.length < 50;

        return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && isLongEnough;
    }
    if (passwordValidity == false) {
        errormsg("Your password must be 8 - 50 characters long and include at least 1 special, 1 uppercase and 1 digit");
		return false;
    }
    else
        return true;
}

//set cookies in sessionStorage
function setCookieSessionStorage(responseData, username) {
	// sessionStorage.setItem('access_token', responseData.access);
	// sessionStorage.setItem('refresh_token', responseData.refresh);

	sessionStorage.setItem('access_token', username);
}

export async function signupProcess() {
    const userData = document.getElementsByClassName('form-control');
    const username = userData[0].value;
    const nickname = userData[1].value;
    const email = userData[2].value;
    const password = userData[3].value;
    const repeatPassword = userData[4].value;

    // if (!signUpFieldsValidity(username, nickname, email, password, repeatPassword)) {
    //     console.log('signupfield not valid')
    //     return;
    // }

    //send variables to microservice via API
    /*
        try/catch is used to get errors when the promise gets rejected (network or CORS issues)
        response.ok is used to handle server errors (404 or 500, for example) when the promise gets resolved
    */
    const sendUserDataToAPI = async (username, nickname, email, password) => {
        await fetch('https://localhost:10444/api/user/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": "username",
                "nickname": "nickname",
                "email": "email@email.com",
                "password": "password"
            }),
                // credentials: 'include' //include cookies
        })
        .then(response => {
                console.log("first then");
                if (!response.ok) //analyze error code or body
                    throw new Error(`HTTP status code ${response.status}`);
                return response.json()
        })
        .then(responseData => {
                console.log("second then");
                if (responseData !== null) {
                    // set access token in httponly cookies
                    sessionStorage.setItem('access_token', username);
                    console.log(JSON.stringify(responseData))
                    urlRoute("/profile");
                }
        })
        .catch(e => console.error('Fetch error: '+ e));
    }

    console.log("before send user data to api");
	await sendUserDataToAPI(username, nickname, email, password);
    console.log("after send user data to api");
    // sessionStorage.setItem('access_token', username);
    // urlRoute("/profile");
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
