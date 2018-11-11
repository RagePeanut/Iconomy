let dialog;

function insertIconsFunctionHandler(selection) {
    if(dialog == null) {
        dialog = document.createElement('dialog');
        dialog.innerHTML = `
<form method="dialog">
    <h1>Fast Icons</h1>
    <input type="text" placeholder="Search an icon...">
    <footer>
        <button id="submit" type="submit" uxp-variant="cta">Add</button>
        <button id="cancel" uxp-variant="primary">Cancel</button>
    </footer>
</form>
        `;
        document.body.appendChild(dialog);

        const cancelButton = document.getElementById('cancel');
        cancelButton.addEventListener('click', oncancel);

        const submitButton = document.getElementById('submit');
        submitButton.addEventListener('click', onsubmit);
    }
    return dialog.showModal()
                 .then(res => console.log(res));
}

function oncancel() {
    dialog.close('Cancelled');
}

function onsubmit() {
    dialog.close('Submitted');
}

module.exports = {
    commands: {
        insertIconsCommand: insertIconsFunctionHandler
    }
}