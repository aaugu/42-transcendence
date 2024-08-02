export async function errormsg(msg) {
    const errorCont = document.getElementById('error-msg');

    errorCont.classList.remove('hidden');
    errorCont.textContent = msg;
    setTimeout(() => {
        errorCont.classList.add('hidden');
    }, 3000);
}
