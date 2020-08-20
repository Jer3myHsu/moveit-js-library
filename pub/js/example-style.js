"user strict";

MoveIt.initializeMoveIt();

MoveIt.setDraggableWith([0,1], [0,1]);

MoveIt.setDraggableWith([2,3,4], [2,3,4]);

MoveIt.itemProperty.forEach(itemProp => {
    if (itemProp.id <= 1) {
        const held = document.createElement("div");
        held.style.height = "60px";
        held.style.width = "60px";
        held.style.backgroundColor = "black";
        held.style.borderRadius = "50%";
        itemProp.elementHeld = held;
        const hover = document.createElement("div");
        hover.style.height = "144px";
        hover.style.width = "204px";
        hover.style.backgroundColor = "blue";
        itemProp.elementHover = hover;
        const origin = document.createElement("div");
        origin.style.height = "144px";
        origin.style.width = "204px";
        origin.style.backgroundColor = "red";
        itemProp.elementOrigin = origin;
        itemProp.holdCenter = true;
    } else if (itemProp.id === 3) {
        itemProp.elementHeldStyle = "animation: spin 0.5s infinite linear;";
        itemProp.elementOriginStyle = "visibility: hidden;";
    } else {
        itemProp.elementHoverStyle = "opacity: 0.5";
    }
});