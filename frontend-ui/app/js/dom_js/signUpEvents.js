import {urlRoute} from "./routerEvents.js"
import {errormsg} from "./utils.js"

function passwordValidity(password)
{
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

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
        errormsg("Your password must be >8 characters long and include >1 special, >1 uppercase and >1 digit");
        return false;
    }
    else
        return true;
}

function clearUserData(userData)
{
    for (var i = 0; i < userData.length; i++)
        userData[i].value = '';
}

export function signUpButton() {
    const userData = document.getElementsByClassName('form-control');
    const username = userData[0].value;
    const nickname = userData[1].value;
    const email = userData[2].value;
    const password = userData[3].value;
    const repeatPassword = userData[4].value;

    if (!signUpFieldsValidity(username, nickname, email, password, repeatPassword)) {
        console.log('signupfield not valid')
        clearUserData(userData);
        return;
    }


    //send variables to microservice via API

    //analyze response from API


   
    //update nickname as well as userSignedIn variable in localstorage 

    // urlRoute("/profile");

    
}


/*
    JSON format user signup:
    "username": ""
    "nickname": ""
    "email": ""
    "password": ""

    JSON format 2fa verification:
    "verification": ""
*/

