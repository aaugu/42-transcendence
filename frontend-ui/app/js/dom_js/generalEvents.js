import {urlRoute} from "./router.js"
import {signUpButton} from "./signUp.js"

document.addEventListener('DOMContentLoaded', (e) => {
    const mainContainer = document.getElementById('main-container');
    mainContainer.addEventListener('click', async function (e) {
        //console.log(e.target.id);
        switch (e.target.id) {
            case "signup":
                console.log("in case signup");
                signUpButton();
                break ;
            default:
                break ;

        }


    })
});
