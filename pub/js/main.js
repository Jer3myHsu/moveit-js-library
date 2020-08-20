"use strict";

MoveIt.initializeMoveIt("content");

MoveIt.setDraggableWith([0], []);
MoveIt.setDraggableWith([1, 2], [0]);


MoveIt.elementOriginStyle = "visibility: hidden;";

MoveIt.itemProperty.forEach(prop => {
    if (!prop.id) prop.elementHoverStyle = "opacity: 0.5; z-index: 1;";
    const element = MoveIt.getItemById(prop.id).cloneNode(true);
    element.style.position = "static";
    element.style.left = "0px";
    element.style.transform = "none";
    prop.elementHeld = element;
});
MoveIt.elementHeldStyle = "transition: transform ease-in-out 0.2s; transform: rotate(25deg);";
MoveIt.dragWeight = 1;