const icons = require('./icons/icons');

let dialog;
let previews;

function insertIconsFunctionHandler(selection) {
    if(dialog == null) {
        dialog = document.createElement('dialog');
        dialog.innerHTML = `
<form method="dialog">
    <h1>Fast Icons</h1>
    <input id="search" type="text" placeholder="Search an icon...">
    <div id="previews">Nothing to show yet.</div>
    <footer>
        <button id="submit" type="submit" uxp-variant="cta">Add</button>
        <button id="cancel" uxp-variant="primary">Cancel</button>
    </footer>
</form>
        `;
        document.body.appendChild(dialog);

        const searchBar = document.getElementById('search');
        searchBar.addEventListener('keyup', () => updatePreviews(searchBar.value));

        const cancelButton = document.getElementById('cancel');
        cancelButton.addEventListener('click', oncancel);

        const submitButton = document.getElementById('submit');
        submitButton.addEventListener('click', onsubmit);

        previews = document.getElementById('previews');
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

function updatePreviews(search) {
    const regex = new RegExp(search.replace(/[ -]+/g, ''), 'i');
    Object.keys(icons).forEach(async iconName => {
        const currentIcon = icons[iconName];
        if(regex.test(iconName) || currentIcon.search.some(term => regex.test(term))) {
            currentIcon.packs.forEach(async iconPack => {
                currentIcon.svg[iconPack].styles.forEach(async iconStyle => {
                    addPreview(iconName, iconPack, iconStyle);
                });
            });
        }
    });
}

function addPreview(name, pack, style) {
    console.log(name, pack, style);
}

module.exports = {
    commands: {
        insertIconsCommand: insertIconsFunctionHandler
    }
}