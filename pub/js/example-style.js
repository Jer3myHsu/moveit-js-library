"user strict";

MoveIt.initializeMoveIt("box");

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
        const whenHeld = document.createElement("div");
        whenHeld.style.height = "144px";
        whenHeld.style.width = "204px";
        whenHeld.style.backgroundColor = "red";
        itemProp.elementWhenHeld = whenHeld;
        itemProp.onHold = (element) => {
            MoveIt.holdCenter = true;
        }
    } else if (itemProp.id === 3) {
        itemProp.elementHeldStyle = "animation: spin 0.5s infinite linear;";
        itemProp.elementWhenHeldStyle = "visibility: hidden;";
        itemProp.onHold = (element) => {
            MoveIt.holdCenter = false;
        }
    } else {
        itemProp.elementHoverStyle = "opacity: 0.5";
        itemProp.onHold = (element) => {
            MoveIt.holdCenter = false;
        }
    }
});