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
const NOTHING_TO_SHOW = 'Nothing to show yet.';

let dialog;
let previews;
let selected;
let searchBar;
let styleFilter;
let packFilter;
let heightField;
let widthField;
let previousSearchRegex;

/**
 * Handles the 'Insert Icons' command
 * @param {any} selection Data about what's currently selected in Adobe XD
 */
function insertIconsFunctionHandler(selection) {
    if(dialog == null) {
        dialog = document.createElement('dialog');
        dialog.innerHTML = `
<link rel="stylesheet" type="text/css" href="dialog.css">
<form method="dialog">
    <h1>Iconomy</h1>
    <input id="search" type="text" placeholder="Search an icon...">
    <div id="filters" class="row">
        <div>
            <h2>Pack</h2>
            <select id="pack">
                <option value="all">All</option>
                <option value="boxicons">Boxicons</option>
                <option value="essentialicons">Essential Icons</option>
                <option value="feather">Feather</option>
                <option value="fontawesome">Font Awesome</option>
                <option value="linearicons">Linearicons</option>
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
        <div id="previews">${ NOTHING_TO_SHOW }</div>
    </div>
    <footer>
        <div id="selected-wrapper">
            <div id="selected"></div>
        </div>
        <button id="submit" type="submit" uxp-variant="cta">Add</button>
        <button id="clear" uxp-variant="primary">Clear</button>
        <button id="cancel" uxp-variant="primary">Cancel</button>
    </footer>
</form>
        `;
        document.body.appendChild(dialog);

        searchBar = document.getElementById('search');
        searchBar.addEventListener('input', () => updatePreviews(true));

        const cancelButton = document.getElementById('cancel');
        cancelButton.addEventListener('click', oncancel);

        const submitButton = document.getElementById('submit');
        submitButton.addEventListener('click', () => onsubmit(selection));

        const clearButton = document.getElementById('clear');
        clearButton.addEventListener('click', () => onclear(false));

        styleFilter = document.getElementById('style');
        styleFilter.value = 'all';
        styleFilter.addEventListener('change', () => updatePreviews(false));

        packFilter = document.getElementById('pack');
        packFilter.value = 'all';
        packFilter.addEventListener('change', () => updatePreviews(false));

        heightField = document.getElementById('height');
        widthField = document.getElementById('width');
        heightField.addEventListener('input', () => {
            const height = parseFloat(heightField.value);
            widthField.setAttribute('placeholder', height && height.toString() || SIZE);
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
            // Setting the node to the div containing the icon
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

/** Closes the plugin's window */
function oncancel() {
    dialog.close('Cancelled');
}

/**
 * Resets all the fields to their default values
 * @param {boolean} calledFromSubmit Whether or not the function has been called from onsubmit()
 */
function onclear(calledFromSubmit) {
    selected.innerHTML = '';
    searchBar.value = '';
    previousSearchRegex = null;
    previews.innerHTML = NOTHING_TO_SHOW;
    styleFilter.value = 'all';
    packFilter.value = 'all';
    if(!calledFromSubmit) {
        heightField.value = '';
        widthField.value = '';
        widthField.placeholder = SIZE;
    }
}

/** Adds the icons to the artboard and resets most of the fields to their default values*/
function onsubmit(selection) {
    addIcons(Array.from(selected.childNodes), selection);
    onclear(true);
    dialog.close('Submitted');
}

/**
 * Updates the previews based on user inputs
 * @param {string} searchChanged Whether or not the function has been called due to a change in the search bar's value
 */
function updatePreviews(searchChanged) {
    const search = searchBar.value;
    const regex = new RegExp(search.replace(/[ -]+/g, ''), 'i');
    // The icons are guaranteed to have already been found by the previous search
    if(searchChanged && previousSearchRegex && previousSearchRegex.test(search)) {
        const previewsArr = previews.childNodes;
        for(let i = previewsArr.length - 1; i >= 0; i--) {
            const name = previewsArr[i].getAttribute('name');
            if(!regex.test(name) && !icons[name].search.some(term => regex.test(term))) previews.removeChild(previewsArr[i]);
        }
    // The icons have not all been found by the previous search
    } else {
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
    previousSearchRegex = regex;
}

/**
 * Adds an icon preview to the previews div
 * @param {string} name The name of the icon
 * @param {string} pack The pack from which the icon comes
 * @param {string} style The style of the icon
 */
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

/**
 * Adds selected icons to the artboard
 * @param {any[]} selectedIcons The selected icons' nodes
 * @param {any} selection Data about what's currently selected in Adobe XD
 */
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

/**
 * Adds an icon to the artboard
 * @param {string} name The name of the icon
 * @param {string} pack The name of the pack the icon comes from
 * @param {string} style The style of the icon
 * @param {string} label The name the icon will have in Adobe XD
 * @param {number} leftOffset The left offset of the icon (compared to the selection's x coordinate) 
 * @param {number} padding The padding to add on the left of the icon to separate it from the previous icon 
 * @param {any} selection Data about what's currently selected in Adobe XD
 * @returns {number} The left offset for the next icon
 */
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
        // Rescaling by resizing each item individually (resizing a group doesn't keep consistent distances between items)
        selection.items.forEach(item => {
            if(item.strokeEnabled) item.strokeWidth = item.strokeWidth * ratio;
            if(item.hasRoundedCorners) item.setAllCornerRadii(item.cornerRadii.topLeft * ratio);
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

/**
 * Creates a rectangle
 * @param {number} height The height of the rectangle
 * @param {number} width The width of the rectangle
 * @param {number} [cornerRadius] The radius of the rectangle's corners
 * @returns {Rectangle} The created rectangle
 */
function createRectangle(height, width, cornerRadius) {
    const rectangle = new Rectangle();
    rectangle.height = height;
    rectangle.width = width;
    if(cornerRadius) rectangle.setAllCornerRadii(cornerRadius);
    return rectangle;
}

/**
 * Creates a circle
 * @param {number} radius The radius of the circle
 * @returns {Ellipse} The created circle
 */
function createCircle(radius) {
    return createEllipse(radius, radius);
}

/**
 * Create an ellipse
 * @param {number} radiusX The x radius of the ellipse
 * @param {number} radiusY The y radius of the ellipse
 * @returns {Ellipse} The created ellipse
 */
function createEllipse(radiusX, radiusY) {
    const ellipse = new Ellipse();
    ellipse.radiusX = radiusX;
    ellipse.radiusY = radiusY;
    return ellipse;
}

/**
 * Creates a line
 * @param {number} startX The starting x coordinate
 * @param {number} startY The starting y coordinate
 * @param {number} endX The ending x coordinate
 * @param {number} endY The ending y coordinate
 * @returns {Line} The created line
 */
function createLine(startX, startY, endX, endY) {
    const line = new Line();
    line.setStartEnd(startX, startY, endX, endY);
    return line;
}

/**
 * Creates a polyline
 * @param {string} points The points of the polyline
 * @returns {Path} The created polyline
 */
function createPolyline(points) {
    return createPath('M' + points);
}

/**
 * Creates a polygon
 * @param {string} points The points of the polygon
 * @returns {Path} The created polygon
 */
function createPolygon(points) {
    return createPath('M' + points);
}

/**
 * Creates a path
 * @param {string} pathData The path's data
 * @returns {Path} The created path
 */
function createPath(pathData) {
    const path = new Path();
    path.pathData = pathData;
    return path;
}

/**
 * Sets the fill of a node
 * @param {any} node The node to set the fill for
 * @param {string} type The type of the node
 * @param {boolean} fillEnabled Whether or not the node should have a fill
 * @param {Color} color The color of the fill
 */
function setFill(node, type, fillEnabled, color) {
    if(type !== 'line') {
        node.fillEnabled = fillEnabled;
        node.fill = color;
    }
}

/**
 * Sets the stroke of a node
 * @param {any} node The node to set the stroke for
 * @param {{width: number, linecap: string, linejoin: string, miterlimit: number, dasharray: number[], dashoffset: number}} stroke Data about the stroke
 * @param {Color} color The color of the stroke
 */
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

/**
 * Applies a transformation to a node
 * @param {string} type The type of transformation
 * @param {any} node The node to apply the transformation to
 * @param {{x: number, y: number} | {center_x: number, center_y: number, radius: number}} data Data about the transformation
 */
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
