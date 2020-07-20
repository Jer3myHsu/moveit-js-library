"use strict";

const log = console.log;//REMOVE ME
let movingElement = undefined;
const moveItGroup = {
    id: undefined,
    itemClassName: undefined,
    dragProperty: [],
};

function initializeGroup(groupId, itemClassName, itemHeight, itemWidth) {
    function initializeId(items, groupId) {
        for (let i = 0; i < items.length; i++) {
            items[i].setAttribute("moveIt-id", i);
        }
    }
    function initialDragProperty(items) {
        const dragProperty = [];
        items.map(item => dragProperty.push(undefined));
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

function canDragWith(srcId, destId) {
    return moveItGroup.dragProperty.length > srcId && moveItGroup.dragProperty[srcId] ?
        moveItGroup.dragProperty[srcId].includes(destId) : true;
}
function getDragWith(itemId) {
    const newProps = [];
    if (moveItGroup.dragProperty[itemId]) {
        moveItGroup.dragProperty[itemId].map(id => {
            if (id < moveItGroup.dragProperty.length && id >= 0 && id !== itemId) {
                newProps.push(id);
            }
        });
        newProps.sort((a, b) => a - b);
        moveItGroup.dragProperty[itemId] = newProps;
    } else {
        moveItGroup.dragProperty.map((prop, i) => i !== itemId && newProps.push(i));
    }
    return newProps;
}

function addDraggableWith(srcIdArr, destIdArr) {
    const allIdArr = [];
    if (srcIdArr === undefined) {
        moveItGroup.dragProperty.map((prop, i) => allIdArr.push(i));
    }
    (srcIdArr || allIdArr).map(srcId => {
        if (moveItGroup.dragProperty.length <= srcId) {
            return;
        }
        if(destIdArr === undefined) {
            moveItGroup.dragProperty[srcId] = undefined;
        } else if (moveItGroup.dragProperty[srcId]) {
            destIdArr.map(destId => {
                if (!moveItGroup.dragProperty[srcId].includes(destId) && destId < moveItGroup.dragProperty.length && destId !== srcId) {
                    moveItGroup.dragProperty[srcId].push(destId);
                }
            });
            moveItGroup.dragProperty[srcId].sort((a, b) => a - b);
        }
    });
}

function setDraggableWith(srcIdArr, destIdArr) {
    const allIdArr = [];
    if (srcIdArr === undefined) {
        moveItGroup.dragProperty.map((prop, i) => allIdArr.push(i));
    }
    (srcIdArr || allIdArr).map(srcId => {
        if (moveItGroup.dragProperty.length <= srcId) {
            return;
        }
        if(destIdArr === undefined) {
            moveItGroup.dragProperty[srcId] = undefined;
        } else {
            moveItGroup.dragProperty[srcId] = destIdArr;
            moveItGroup.dragProperty[srcId].sort((a, b) => a - b);
        }
    });
}

function removeDraggableWith(srcIdArr, destIdArr) {
    const allIdArr = [];
    if (srcIdArr === undefined) {
        moveItGroup.dragProperty.map((prop, i) => allIdArr.push(i));
    }
    (srcIdArr || allIdArr).map(srcId => {
        if (moveItGroup.dragProperty.length <= srcId) {
            return;
        }
        if(destIdArr === undefined) {
            moveItGroup.dragProperty[srcId] = [];
            return;
        } else if (!moveItGroup.dragProperty[srcId]) {
            const allIdArr = [];
            moveItGroup.dragProperty.map((prop, i) => allIdArr.push(i));
            moveItGroup.dragProperty[srcId] = allIdArr;
        }
        destIdArr.map(destId => {
            const index = moveItGroup.dragProperty[srcId].indexOf(destId);
            if (index >= 0) {
                moveItGroup.dragProperty[srcId].splice(index, 1);
            }
        });
        if (allIdArr === moveItGroup.dragProperty[srcId]) {
            moveItGroup.dragProperty[srcId] = undefined;
        } else {
            moveItGroup.dragProperty[srcId].sort((a, b) => a - b);
        }
    });
}

function getItemById(itemId) {
    try {
        return getItemsInGroup().filter(item => parseInt(item.getAttribute("moveIt-id")) === itemId)[0];
    } catch(e) {
        return undefined;
    }
}

function getIdByItem(item) {
    try {
        return parseInt(item.getAttribute("moveIt-id"));
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
    if (item && getDragWith(getIdByItem(item)).length > 0) {
        holdItem(item);
    }
});

window.addEventListener("mouseup", function(e) {
    const releasedItemId = releaseItem();
    const releasedItem = getItemById(releasedItemId);
    const itemOver = getItemMouseOver(e);
    if (releasedItem && itemOver && itemOver !== releasedItem && canDragWith(releasedItemId, getIdByItem(itemOver))) {
        swap(itemOver, releasedItem);
    }
});