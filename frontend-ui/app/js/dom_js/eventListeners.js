import { urlRoute } from "./router.js"

document.addEventListener('DOMContentLoaded', (e) => {
    const mainContainer = document.getElementById('main-container');
    mainContainer.addEventListener('click', async function (e) {
        switch (e.target.id) {
            // case "signup-submit":
            //     console.log("button click: signup-submit");
            //     signUpButton();
            //     break;
            // case "login-submit":
            //     console.log("button click: login-submit");
            //     loginButton();
            //     break;
            // case "signup":
            //     console.log("button click: signup");
            //     urlRoute(e.target.getAttribute('href'));
            //     break;
            // case "login":
            //     console.log("button click: login");
            //     urlRoute(e.target.getAttribute('href'));
            //     break;
            // case "logout":
            //     console.log("button click: logout");
            //     logoutButton();
            //     break;
            default:
                break ;

        }


    })
});
