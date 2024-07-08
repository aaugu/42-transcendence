import {inputValue} from "./inputField.js"
import {urlRoute} from "./router.js"

document.addEventListener('DOMContentLoaded', (e) => {
    

});

const signInBtn = document.getElementById('signup');

signInBtn.addEventListener('click', async function (e) {
    inputValue('username');
});