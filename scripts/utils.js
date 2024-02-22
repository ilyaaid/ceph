function formToObject(formEl) {
    return Object.fromEntries(new FormData(formEl));
}


function addErrorToForm(formEl, inputName, error = '') {
    const inputEl = formEl.querySelector('input[name=' + inputName + ']');
    inputEl.classList.add('error-input');
}

function removeErrorsInForm(formEl) {
    const inputs = formEl.querySelectorAll('.error-input');
    inputs.forEach(input => {
        input.classList.remove('error-input')
    })
}
