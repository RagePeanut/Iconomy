const { 
    Rectangle,
    Ellipse,
    Line,
    Path,
    Color 
} = require('scenegraph');
const commands = require('commands');

const icons = require('./icons/icons');

let dialog;
let previews;
let selected;
let styleFilter;
let packFilter;
let heightField;
let widthField;

function insertIconsFunctionHandler(selection) {
    if(dialog == null) {
        dialog = document.createElement('dialog');
        dialog.innerHTML = `
<link rel="stylesheet" type="text/css" href="dialog.css">
<form method="dialog">
    <h1>Fast Icons</h1>
    <input id="search" type="text" placeholder="Search an icon...">
    <div id="filters" class="row">
        <div>
            <h2>Pack</h2>
            <select id="pack">
                <option value="all">All</option>
                <option value="fontawesome">Font Awesome</option>
            </select>
        </div>
        <div>
            <h2>Style</h2>
            <select id="style">
                <option value="all">All</option>
                <option value="regular">Regular</option>
                <option value="solid">Solid</option>
                <option value="brands">Brands</option>
            </select>
        </div>
    </div>
    <div id="size" class="row">
        <div>
            <h2>Height</h2>
            <input id="height" type="number" placeholder="40">
        </div>
        <div>
            <h2>Max Width</h2>
            <input id="width" type="number" placeholder="40">
        </div>
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

        packFilter = document.getElementById('pack');
        packFilter.value = 'all';
        packFilter.addEventListener('change', () => {
            updatePreviews(searchBar.value);
        });

        heightField = document.getElementById('height');
        widthField = document.getElementById('width');
        heightField.addEventListener('keyup', () => {
            widthField.setAttribute('placeholder', heightField.value);
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
    packFilter.value = 'all';
    dialog.close('Submitted');
}

function updatePreviews(search) {
    const regex = new RegExp(search.replace(/[ -]+/g, ''), 'i');
    previews.innerHTML = '';
    Object.keys(icons).forEach(async name => {
        const currentIcon = icons[name];
        if(regex.test(name) || currentIcon.search.some(term => regex.test(term))) {
            currentIcon.packs.forEach(async pack => {
                if(['all', pack].includes(packFilter.value)) {
                    currentIcon.svg[pack].styles.forEach(async style => {
                        if(['all', style].includes(styleFilter.value)) addPreview(name, pack, style);
                    });
                }
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
    let padding = 0, leftOffset = 0;
    selectedIcons.forEach(icon => {
        const name = icon.getAttribute('name');
        const style = icon.classList.item(1);
        const pack = icon.classList.item(2);
        const label = icon.childNodes.item(0).getAttribute('alt');
        leftOffset += addIcon(name, pack, style, label, leftOffset, padding, selection);
        selectedItems.push(selection.items[0]);
        padding = leftOffset / selectedItems.length * 0.3;
    });
    selection.items = selectedItems;
    if(selection.items.length > 1) commands.alignVerticalCenter();
}

function addIcon(name, pack, style, label, leftOffset, padding, selection) {
    const color = new Color('Black');
    selection.items = null;
    icons[name].svg[pack][style].forEach(part => {
        let placingPoint;
        const graphicNode = (() => {
            switch(part.tag) {
                case 'rect': 
                    placingPoint = { x: part.data.x, y: part.data.y };
                    return createRectangle(part.data.height, part.data.width, color, part.data.top_left_radius, part.data.top_right_radius, part.data.bottom_right_radius, part.data.bottom_left_radius);
                case 'circle': 
                    placingPoint = { x: part.data.center_x - part.data.radius, y: part.data.center_y - part.data.radius };
                    return createCircle(part.data.radius, color);
                case 'ellipse': 
                    placingPoint = { x: part.data.center_x - part.data.radius_x, y: part.data.center_y - part.data.radius_y };
                    return createEllipse(part.data.radius_x, part.data.radius_y, color);
                case 'line': return createLine(part.data.start_x, part.data.start_y, part.data.end_x, part.data.end_y, color);
                case 'polyline': return createPolyline(part.data, color);
                case 'polygon': return createPolygon(part.data, color);
                default: return createPath(part.data, color);
            }
        })();
        selection.insertionParent.addChild(graphicNode);
        if(placingPoint) graphicNode.placeInParentCoordinates({ x: 0, y: 0 }, placingPoint);
        selection.items = selection.items.concat([graphicNode]);
    });
    if(selection.items.length > 1) commands.group();
    const icon = selection.items[0];
    icon.name = label;
    icon.moveInParentCoordinates(leftOffset + padding, 0);
    const localBounds = icon.localBounds;
    let height = (!isNaN(heightField.value) && heightField.value) || 40;
    let width = height * localBounds.width / localBounds.height;
    if(!widthField.value || isNaN(widthField.value)) widthField.value = height;
    if(width > widthField.value) {
        width = widthField.value;
        height = width * localBounds.height / localBounds.width;
    }
    icon.resize(width, height);
    return padding + width;
}

function createRectangle(height, width, color, cornerRadius) {
    const rectangle = new Rectangle();
    rectangle.height = height;
    rectangle.width = width;
    if(cornerRadius) {
        rectangle.cornerRadii = { 
            topLeft: cornerRadius, 
            topRight: cornerRadius, 
            bottomRight: cornerRadius, 
            bottomLeft: cornerRadius
        };
    }
    rectangle.fill = color;
    return rectangle;
}

function createCircle(radius, color) {
    return createEllipse(radius, radius, color);
}

function createEllipse(radiusX, radiusY, color) {
    const ellipse = new Ellipse();
    ellipse.radiusX = radiusX;
    ellipse.radiusY = radiusY;
    ellipse.fill = color;
    return ellipse;
}

function createLine(startX, startY, endX, endY, color) {
    const line = new Line();
    line.setStartEnd(startX, startY, endX, endY);
    line.fill = color;
    return line;
}

function createPolyline(points, color) {
    return createPath('M' + points + 'z', color);
}

function createPolygon(points, color) {
    return createPath('M' + points + 'z', color);
}

function createPath(pathData, color) {
    const path = new Path();
    path.pathData = pathData;
    path.fill = color;
    return path;
}

module.exports = {
    commands: {
        insertIconsCommand: insertIconsFunctionHandler
    }
}