const icons = require('./icons/icons');

let dialog;
let previews;
let selected;

function insertIconsFunctionHandler(selection) {
    if(dialog == null) {
        dialog = document.createElement('dialog');
        dialog.innerHTML = `
<link rel="stylesheet" type="text/css" href="dialog.css">
<form method="dialog">
    <h1>Fast Icons</h1>
    <input id="search" type="text" placeholder="Search an icon...">
    <div id="previews-wrapper">
        <div id="previews">Nothing to show yet.</div>
    </div>
    <footer>
        <div id="selected-wrapper">
            <div id="selected"></div>
        </div>
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

        selected = document.getElementById('selected');

        previews = document.getElementById('previews');
        previews.addEventListener('click', event => {
            let node;
            if(event.target.classList.contains('preview')) node = event.target;
            else if(event.target.classList.contains('icon')) node = event.target.parentNode;
            else return;
            const name = node.getAttribute('name');
            const style = node.classList.item(1);
            const pack = node.classList.item(2);
            const icon = node.childNodes.item(0);
            
            const selectedPreview = document.createElement('div');
            selectedPreview.classList.add('selected-preview', style, pack);
            selectedPreview.setAttribute('name', name);

            const selectedIcon = document.createElement('img');
            selectedIcon.src = icon.src;
            selectedIcon.classList.add('selected-icon', style, pack);
            selectedIcon.setAttribute('name', name);
            selectedIcon.setAttribute('alt', icon.getAttribute('alt'));
            selectedPreview.appendChild(selectedIcon);

            selected.appendChild(selectedPreview);
        });
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
    previews.innerHTML = '';
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
    const preview = document.createElement('div');
    preview.classList.add('preview', style, pack);
    preview.setAttribute('name', name);

    const icon = document.createElement('img');
    icon.src = 'icons/' + pack + '/' + style + '/' + name + '.png';
    icon.classList.add('icon', style, pack);
    icon.setAttribute('name', name);
    icon.setAttribute('alt', icons[name].label);
    preview.appendChild(icon);

    previews.appendChild(preview);
}

module.exports = {
    commands: {
        insertIconsCommand: insertIconsFunctionHandler
    }
}