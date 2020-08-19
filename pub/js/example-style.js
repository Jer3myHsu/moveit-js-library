"user strict";

moveIt.initializeMoveIt("box");

moveIt.setDraggableWith([0,1], [0,1]);

moveIt.setDraggableWith([2,3,4], [2,3,4]);

moveIt.itemProperty.forEach(itemProp => {
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
    } else if (itemProp.id === 3) {
        itemProp.elementHeldStyle = "animation: spin 0.5s infinite linear;";
        itemProp.elementWhenHeldStyle = "visibility: hidden;";
    } else {
        itemProp.elementHoverStyle = "opacity: 0.5";
    }
});
moveIt.holdCenter = true;