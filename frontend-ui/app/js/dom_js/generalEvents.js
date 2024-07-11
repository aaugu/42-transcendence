import {urlRoute} from "./routerEvents.js"
import {signUpButton} from "./signUpEvents.js"

document.addEventListener('DOMContentLoaded', (e) => {
    const mainContainer = document.getElementById('main-container');
    mainContainer.addEventListener('click', async function (e) {
        switch (e.target.id) {
            case "signup-submit":
                console.log("in case signup-submit");
                signUpButton();
                break ;
            
            default:
                break ;

        }


    })
});
