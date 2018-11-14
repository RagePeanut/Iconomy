const { 
    GraphicNode,
    Rectangle,
    Ellipse,
    Line,
    Path,
    Color 
} = require('scenegraph');
const commands = require('commands');

const icons = require('./icons/icons');

const SIZE = 40;

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
                <option value="boxicons">BoxIcons</option>
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
            <input id="height" type="number" placeholder="${ SIZE }">
        </div>
        <div>
            <h2>Max Width</h2>
            <input id="width" type="number" placeholder="${ SIZE }">
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
        searchBar.addEventListener('input', () => updatePreviews(searchBar.value));

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
        heightField.addEventListener('input', () => {
            widthField.setAttribute('placeholder', parseFloat(heightField.value) || SIZE);
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
                    return createRectangle(part.data.height, part.data.width, part.data.corner_radius);
                case 'circle': 
                    placingPoint = { x: part.data.center_x - part.data.radius, y: part.data.center_y - part.data.radius };
                    return createCircle(part.data.radius);
                case 'ellipse': 
                    placingPoint = { x: part.data.center_x - part.data.radius_x, y: part.data.center_y - part.data.radius_y };
                    return createEllipse(part.data.radius_x, part.data.radius_y);
                case 'line': return createLine(part.data.start_x, part.data.start_y, part.data.end_x, part.data.end_y);
                case 'polyline': return createPolyline(part.data);
                case 'polygon': return createPolygon(part.data);
                default: return createPath(part.data);
            }
        })();
        selection.insertionParent.addChild(graphicNode);
        if(placingPoint) graphicNode.placeInParentCoordinates({ x: 0, y: 0 }, placingPoint);
        part.transforms.forEach(transform => transformNode(transform.type, graphicNode, transform.data));
        setFill(graphicNode, part.tag, part.fill, color);
        if(part.stroke) setStroke(graphicNode, part.stroke, color);
        selection.items = selection.items.concat([graphicNode]);
    });
    const multipleParts = selection.items.length > 1;
    if(multipleParts) commands.group();
    const icon = selection.items[0];
    const localBounds = icon.localBounds;
    let height = (!isNaN(heightField.value) && parseFloat(heightField.value)) || SIZE;
    let width = height * localBounds.width / localBounds.height;
    const widthFieldValue = (!widthField.value || isNaN(widthField.value)) ? height : parseFloat(widthField.value);
    if(width > widthFieldValue) {
        width = widthFieldValue;
        height = width * localBounds.height / localBounds.width;
    }
    if(!multipleParts) icon.resize(width, height);
    else {
        const ratio = height / localBounds.height;
        const iconTopLeft = icon.topLeftInParent;
        commands.ungroup();
        selection.items.forEach(item => {
            const x = iconTopLeft.x + (item.topLeftInParent.x - iconTopLeft.x) * (ratio - 1);
            const y = iconTopLeft.y + (item.topLeftInParent.y - iconTopLeft.y) * (ratio - 1);
            item.resize(item.localBounds.width * ratio, item.localBounds.height * ratio);
            item.moveInParentCoordinates(x, y);
        });
        commands.group();
    }
    selection.items[0].name = label;
    selection.items[0].moveInParentCoordinates(leftOffset + padding, 0);
    return padding + width;
}

function createRectangle(height, width, cornerRadius) {
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
    return rectangle;
}

function createCircle(radius) {
    return createEllipse(radius, radius);
}

function createEllipse(radiusX, radiusY) {
    const ellipse = new Ellipse();
    ellipse.radiusX = radiusX;
    ellipse.radiusY = radiusY;
    return ellipse;
}

function createLine(startX, startY, endX, endY) {
    const line = new Line();
    line.setStartEnd(startX, startY, endX, endY);
    return line;
}

function createPolyline(points) {
    return createPath('M' + points);
}

function createPolygon(points) {
    return createPath('M' + points);
}

function createPath(pathData) {
    const path = new Path();
    path.pathData = pathData;
    return path;
}

function setFill(node, type, fillEnabled, color) {
    if(type !== 'line') {
        node.fillEnabled = fillEnabled;
        node.fill = color;
    }
}

function setStroke(node, stroke, color) {
    node.strokeEnabled = true;
    node.stroke = color;
    node.strokeWidth = stroke.width;
    node.strokeEndCaps = GraphicNode['STROKE_CAP_' + stroke.linecap.toUpperCase()];
    node.strokeJoins = GraphicNode['STROKE_JOIN_' + stroke.linejoin.toUpperCase()];
    node.strokeMiterLimit = stroke.miterlimit;
    node.strokeDashArray = stroke.dasharray;
    node.strokeDashOffset = stroke.dashoffset;
}

function transformNode(type, node, data) {
    switch(type) {
        case 'translate':
            node.translation = data;
            break;
        case 'rotate':
            if(!data.hasOwnProperty('center_x')) {
                data.center_x = node.localCenterPoint.x;
                data.center_y = node.localCenterPoint.y;
            }
            node.rotateAround(data.radius, { x: data.center_x, y: data.center_y });
    }
}

module.exports = {
    commands: {
        insertIconsCommand: insertIconsFunctionHandler
    }
}