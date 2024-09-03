export function hideModal(modal_name) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modal_name));
    if (modal) {
        setTimeout(() => {
            modal.hide();
        }, 500);
    }
}