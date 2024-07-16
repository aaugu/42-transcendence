import { urlRoute } from "./router.js"
import { errormsg } from "./utils.js"
import { user_is_active, fa_is_active } from "./user.js";

function passwordValidity(password)
{
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8 && password.length < 50;

    return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && isLongEnough;
}

function emailValidity(email)
{
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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
    else if (emailValidity(email) == false) {
        errormsg("Enter a valid email");
        return false;
    }
    else if (passwordValidity(password) == false) {
        errormsg("Your password must be 8 - 50 characters long and include at least 1 special, 1 uppercase and 1 digit");
		return false;
    }
    else
        return true;
}

//save userData in backend, save token in localStorage
async function sendUserDataToAPI() {
	    //send variables to microservice via API
    /*
        try/catch is used to get errors when the promise gets rejected (network or CORS issues)
        response.ok is used to handle server errors (404 or 500, for example) when the promise gets resolved
    */
    // await fetch('https://172.20.0.2/api/user/', {
    //     method: 'POST',
    //     headers: {
    //         'Accept': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         "username": username,
    //         "nickname": nickname,
    //         "email": email,
    //         "password": password
    //     })
    // })
    // .then(response => {
    //         if (!response.ok) //analyze error code or body
    //             throw new Error(`HTTP status code ${response.status}`);
    //         return response.json()
    // })
    // .then(responseData => {
    //         if (responseData !== null) {
					localStorage.setItem('access_token', responseData.access);
					// localStorage.setItem('refresh_token', responseData.refresh);
    //             console.log(JSON.stringify(responseData))
    //             // urlRoute("/profile");
    //         }
    // })
    // .catch(e => console.error('Fetch error: '+ e));


}

export async function signUpButton() {
    const userData = document.getElementsByClassName('form-control');
    const username = userData[0].value;
    const nickname = userData[1].value;
    const email = userData[2].value;
    const password = userData[3].value;
    const repeatPassword = userData[4].value;

    if (!signUpFieldsValidity(username, nickname, email, password, repeatPassword)) {
        console.log('signupfield not valid')
        return;
    }

	await sendUserDataToAPI();

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
