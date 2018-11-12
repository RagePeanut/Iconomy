const { Path, Color } = require('scenegraph');
const commands = require('commands');

const icons = require('./icons/icons');

let dialog;
let previews;
let selected;
let styleFilter;

function insertIconsFunctionHandler(selection) {
    if(dialog == null) {
        dialog = document.createElement('dialog');
        dialog.innerHTML = `
<link rel="stylesheet" type="text/css" href="dialog.css">
<form method="dialog">
    <h1>Fast Icons</h1>
    <input id="search" type="text" placeholder="Search an icon...">
    <div>
        <h2>Pack</h2>
        <select id="style">
            <option value="all">All</option>
            <option value="regular">Regular</option>
            <option value="solid">Solid</option>
            <option value="brands">Brands</option>
        </select>
    </div>
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
        submitButton.addEventListener('click', () => onsubmit(selection));

        styleFilter = document.getElementById('style');
        styleFilter.value = 'all';
        styleFilter.addEventListener('change', () => {
            updatePreviews(searchBar.value);
        });

        selected = document.getElementById('selected');
        selected.addEventListener('click', event => {
            let toRemove;
            if(event.target.classList.contains('selected-preview')) toRemove = event.target;
            else if(event.target.classList.contains('selected-icon')) toRemove = event.target.parentNode;
            else return;
            selected.removeChild(toRemove);
        });

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

function onsubmit(selection) {
    addIcons(Array.from(selected.childNodes), selection);
    selected.innerHTML = '';
    document.getElementById('search').value = '';
    previews.innerHTML = 'Nothing to show yet.';
    styleFilter.value = 'all';
    dialog.close('Submitted');
}

function updatePreviews(search) {
    const regex = new RegExp(search.replace(/[ -]+/g, ''), 'i');
    previews.innerHTML = '';
    Object.keys(icons).forEach(async name => {
        const currentIcon = icons[name];
        if(regex.test(name) || currentIcon.search.some(term => regex.test(term))) {
            currentIcon.packs.forEach(async pack => {
                currentIcon.svg[pack].styles.forEach(async style => {
                    if(['all', style].includes(styleFilter.value)) addPreview(name, pack, style);
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

function addIcons(selectedIcons, selection) {
    const selectedItems = [];
    let offset = 0;
    selectedIcons.forEach(icon => {
        const name = icon.getAttribute('name');
        const style = icon.classList.item(1);
        const pack = icon.classList.item(2);
        const label = icon.childNodes.item(0).getAttribute('alt');
        offset = addIcon(name, pack, style, label, offset, selection);
        selectedItems.push(selection.items[0]);
    });
    selection.items = selectedItems;
    if(selection.items.length > 1) commands.alignVerticalCenter();
}

function addIcon(name, pack, style, label, offset, selection) {
    selection.items = null;
    icons[name].svg[pack][style].forEach(part => {
        if(part.tag === 'path') {
            const path = createPath(part.data, 'Black');
            selection.insertionParent.addChild(path);
            selection.items = selection.items.concat([path]);
        }
    });
    if(selection.items.length > 1) commands.group();
    const icon = selection.items[0];
    icon.name = label;
    icon.moveInParentCoordinates(offset, 0);
    return offset + icon.localBounds.width;
}

function createPath(pathData, color) {
    const path = new Path();
    path.pathData = pathData;
    path.fill = new Color(color);
    return path;
}

module.exports = {
    commands: {
        insertIconsCommand: insertIconsFunctionHandler
    }
}