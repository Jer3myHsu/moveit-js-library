"use strict";

moveIt.initializeMoveIt("content");

moveIt.setDraggableWith([0], []);
moveIt.setDraggableWith([1, 2], [0]);


moveIt.elementWhenHeldStyle = "visibility: hidden;";

moveIt.itemProperty.forEach(prop => {
    if (!prop.id) prop.elementHoverStyle = "opacity: 0.5; z-index: 1;";
    const element = moveIt.getItemById(prop.id).cloneNode(true);
    element.style.position = "static";
    element.style.left = "0px";
    element.style.transform = "none";
    prop.elementHeld = element;
});
moveIt.elementHeldStyle = "transition: transform ease-in-out 0.2s; transform: rotate(25deg);";
moveIt.dragWeight = 1;