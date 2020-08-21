"user strict";

MoveIt.initializeMoveIt();

MoveIt.itemProperty.forEach(itemProp => {
    const item = MoveIt.getItemById(itemProp.id);
    const held = item.cloneNode(true);
    const hover = item.cloneNode(true);
    const origin = item.cloneNode(true);
    held.innerText = "element held";
    hover.innerText = "element hovered";
    origin.innerText = "element origin";
    itemProp.elementHeld = held;
    itemProp.elementHeldStyle = "opacity: 0.8;";
    itemProp.elementHover = hover;
    itemProp.elementOrigin = origin;
});