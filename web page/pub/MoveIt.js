"use strict";

const log = console.log;
let movingElement = null;
const moveItGroup = {
    id: undefined,
    itemClassName: undefined,
    dragProperty: [],
};

function createGroup(groupId, itemClassName, itemHeight, itemWidth) {
    function initializeId(items, groupId) {
        for (let i = 0; i < items.length; i++) {
            items[i].setAttribute("moveIt-id", i);
        }
    }
    function initialDragProperty(items) {
        const dragProperty = [];
        for (let i = 0; i < items.length; i++) {
            dragProperty.push({
                id: i,
                canDragWith: undefined,
            });
        }
        return dragProperty;
    }
    moveItGroup.id = groupId;
    moveItGroup.itemClassName = itemClassName;
    moveItGroup.dragProperty = initialDragProperty(getItemsInGroup());
    initializeId(getItemsInGroup(), groupId);
}

function getItemsInGroup() {
    function getItems(element, itemClass, result) {
        if (!element) {
            return;
        }
        if (element.className.split(" ").includes(itemClass)) {
            result.push(element);
        } else {
            getItems(element.firstElementChild, itemClass, result);
        }
        getItems(element.nextElementSibling, itemClass, result);
        return result;
    }
    return getItems(document.querySelector("#" + moveItGroup.id), moveItGroup.itemClassName, []);
}

function isInGroup(item) {
    const classes = item.className.split(" ");
    return classes.includes(moveItGroup.itemClassName);
}

function getItemById(itemId) {
    try {
        return getItemsInGroup().filter(item => item.getAttribute("moveIt-id") === itemId)[0];
    } catch(e) {
        return undefined;
    }
}

function getIdByItem(item) {
    try {
        return item.getAttribute("moveIt-id");
    } catch(e) {
        return undefined;
    }
}

function swap(itemOne, itemTwo) {    
    if (isInGroup(itemOne) && isInGroup(itemTwo)) {
        const temp = itemOne.outerHTML;
        itemOne.outerHTML = itemTwo.outerHTML;
        itemTwo.outerHTML = temp;
    }
}

function holdItem(item) {
    document.body.style.cursor = "grabbing";
    document.body.style.overflow = "hidden";
    document.body.style["user-select"] = "none";
    movingElement = document.createElement("div");
    movingElement.innerHTML = item.outerHTML;
    movingElement.setAttribute("moveIt-id", getIdByItem(item));
    movingElement.style.position = "absolute";
    movingElement.style["z-index"] = Number.MAX_SAFE_INTEGER;// other notation has issue with hyphen
    movingElement.style["pointer-events"] = "none";
    movingElement.style.visibility = "hidden";
    document.body.appendChild(movingElement);
}

function releaseItem() {
    if (movingElement) {
        movingElement.style.visibility = "hidden";
        document.body.removeChild(movingElement);
        const id = getIdByItem(movingElement);
        movingElement = null;
        document.body.style.overflow = "auto";
        document.body.style.cursor = "auto";
        document.body.style["user-select"] = "auto";
        return id;
    }
}

function getItemMouseOver(e) {
    for (let i = 0; i < e.path.length; i++) {
        const classes = e.path[i].className;
        if (classes && classes.split(" ").includes(moveItGroup.itemClassName)) {
            return e.path[i];
        }
    }
}

window.addEventListener("mousemove", function(e){
    // Help from
    //https://stackoverflow.com/questions/45706937/how-do-i-have-an-element-follow-the-mouse-without-jquery
    if (movingElement) {
        movingElement.style.visibility = "visible";
        const left = e.pageX - movingElement.clientWidth/2;
        const top = e.pageY - movingElement.clientHeight/2;
        movingElement.style.left = left + "px";
        movingElement.style.top = top + "px";
    }
});

window.addEventListener("mousedown", function(e) {
    const item = getItemMouseOver(e);
    if (item) {
        holdItem(item);
    }
});

window.addEventListener("mouseup", function(e) {
    const releasedItem = getItemById(releaseItem());
    const item = getItemMouseOver(e);
    if (!releasedItem || !item || item === releasedItem) {
    } else {
        swap(item, releasedItem);
    }
});