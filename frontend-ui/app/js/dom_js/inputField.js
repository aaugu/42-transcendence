export function inputValue(elementId) {
    const inputValue = document.getElementById(elementId);
    console.log('input field value: ' +inputValue.value);
    return inputValue.value;
}