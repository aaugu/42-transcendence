import {inputValue} from "./utils.js"

export function signUpButton() {
    const signInBtn = document.getElementById('signup');
    inputValue('username');
    inputValue('nickname');
    inputValue('email');
}