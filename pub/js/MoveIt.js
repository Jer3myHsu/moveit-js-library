"use strict";

const moveIt = {
    id: undefined,
    itemProperty: [],
    heldId: undefined,
    heldElement: undefined,
    heldElementPlaceholder: undefined,
    heldElementClass: undefined,
    hoverElementPlaceholder: undefined,
    hoverElementClass: undefined,

    holdCursor: undefined,
    elementHeld: undefined,
    elementHeldStyle: undefined,
    elementHover: undefined,
    elementHoverStyle: undefined,
    elementWhenHeld: undefined,
    elementWhenHeldStyle: undefined,
    animation: undefined,
    onHold: undefined,
    onRelease: undefined,
    onSwap: undefined,
    initializeMoveIt: (id) => {
        function initializeId(items) {
            for (let i = 0; i < items.length; i++) {
                items[i].setAttribute("moveit-id", i);
            }
        }
        function initialItemProperty(items) {
            const itemProperty = [];
            items.map((item, i) => itemProperty.push({
                id: i,
                holdCursor: undefined,
                elementHeld: undefined,
                elementHeldStyle: undefined,
                elementHover: undefined,
                elementHoverStyle: undefined,
                elementWhenHeld: undefined,
                elementWhenHeldStyle: undefined,
                animation: undefined,
                onHold: undefined,
                onRelease: undefined,
                onSwap: undefined,
                swapGroup: undefined
            }));
            return itemProperty;
        }
        function mouseMove(e, shiftX, shiftY) {
            if (moveIt.heldElement) {
                const left = e.pageX - shiftX;
                const top = e.pageY - shiftY;
                moveIt.heldElement.style.left = left + "px";
                moveIt.heldElement.style.top = top + "px";
            }
        }
        moveIt.id = id;
        moveIt.itemProperty = initialItemProperty(moveIt.getItems());
        initializeId(moveIt.getItems());
        window.addEventListener("mousedown", function(e) {
            if (e.button === 0) {
                const item = moveIt.getItemMouseOver(e);
                const itemProperty = moveIt.getItemProperty(moveIt.getIdByItem(item));
                if (item && itemProperty.swapGroup.length > 0) {
                    moveIt.holdItem(item);
                    const shiftX = e.pageX - item.getBoundingClientRect().left;
                    const shiftY = e.pageY - item.getBoundingClientRect().top;
                    const id = moveIt.getIdByItem(item);
                    moveIt.heldElementClass = item.className;
                    item.className = "";
                    log(moveIt.elementWhenHeld)
                    log((itemProperty.elementWhenHeld || moveIt.elementWhenHeld) || "")
                    item.innerHTML = (itemProperty.elementWhenHeld || moveIt.elementWhenHeld) || "";
                    item.setAttribute("moveit-id", id);
                    item.setAttribute("style", itemProperty.elementWhenHeldStyle || moveIt.elementWhenHeldStyle);
                    mouseMove(e, shiftX, shiftY);
                    const mouseListener = (e) => mouseMove(e, shiftX, shiftY);
                    window.addEventListener("mousemove", mouseListener);
                    window.addEventListener("mouseup", function(e) {
                        const releasedItemId = moveIt.releaseItem();
                        const releasedItem = moveIt.getItemById(releasedItemId);
                        const itemOver = moveIt.getItemMouseOver(e);
                        typeof moveIt.onRelease === "function" && moveIt.onRelease(releasedItem, itemOver);
                        if (releasedItem && itemOver && itemOver !== releasedItem && moveIt.canDragWith(releasedItemId,
                            moveIt.getIdByItem(itemOver))) {
                            typeof moveIt.onSwap === "function" && moveIt.onSwap(releasedItem, itemOver);
                            moveIt.swap(releasedItem, itemOver);
                        }
                        window.removeEventListener("mousemove", mouseListener);
                    }, {once: true});
                }
            }
        });
        
    },
    getItems: () => {
        function getItemsHelper(element,  result) {
            if (!element) {
                return;
            }
            if (element.getAttributeNames().includes("moveit-item")) {
                result.push(element);
            } else {
                getItemsHelper(element.firstElementChild, result);
            }
            getItemsHelper(element.nextElementSibling, result);
            return result;
        }
        return getItemsHelper(moveIt.id ? document.querySelector("#" + moveIt.id) : document.body, []);
    },
    isInGroup: (item) => {
        const attributes = item.getAttributeNames();
        return attributes.includes("moveit-item");
    },
    canDragWith: (srcId, destId) => {
        return moveIt.itemProperty.length > srcId && moveIt.getItemProperty(srcId).swapGroup ?
            moveIt.getItemProperty(srcId).swapGroup.includes(destId) : true;
    },
    cleanItemProperty: (removeBadId) => {

    },
    getItemProperty: (itemId) => {
        return moveIt.itemProperty.find(item => item.id === itemId);
    },
    addDraggableWith: (srcIdArr, destIdArr) => {
        const allIdArr = [];
        if (srcIdArr === undefined) {
            moveIt.itemProperty.map(prop => allIdArr.push(prop.id));
        }
        (srcIdArr || allIdArr).map(srcId => {
            // If given id is greater than the maximum possible id, then skip it
            if (moveIt.itemProperty.length <= srcId) {
                return;
            }
            if(destIdArr === undefined) {
                moveIt.getItemProperty(srcId).swapGroup = undefined;
            } else if (moveIt.getItemProperty(srcId).swapGroup) {
                destIdArr.map(destId => {
                    if (!moveIt.getItemProperty(srcId).swapGroup.includes(destId) &&
                        destId < moveIt.itemProperty.length && destId !== srcId) {
                        moveIt.getItemProperty(srcId).swapGroup.push(destId);
                    }
                });
                moveIt.getItemProperty(srcId).swapGroup.sort((a, b) => a - b);
            }
        });
    },
    setDraggableWith: (srcIdArr, destIdArr) => {
        const allIdArr = [];
        if (srcIdArr === undefined) {
            moveIt.itemProperty.map(prop => allIdArr.push(prop.id));
        }
        (srcIdArr || allIdArr).forEach(srcId => {
            if (moveIt.itemProperty.length <= srcId) {
                return;
            }
            if(destIdArr === undefined) {
                moveIt.getItemProperty(srcId).swapGroup = undefined;
            } else {
                moveIt.getItemProperty(srcId).swapGroup = destIdArr;
                moveIt.getItemProperty(srcId).swapGroup.sort((a, b) => a - b);
            }
        });
    },
    removeDraggableWith: (srcIdArr, destIdArr) => {
        const allIdArr = [];
        if (srcIdArr === undefined) {
            moveIt.itemProperty.map(prop => allIdArr.push(prop.id));
        }
        (srcIdArr || allIdArr).map(srcId => {
            if (moveIt.itemProperty.length <= srcId) {
                return;
            }
            if(destIdArr === undefined) {
                moveIt.getItemProperty(srcId).swapGroup = [];
                return;
            } else if (!moveIt.itemProperty[srcId]) {
                const allIdArr = [];
                moveIt.itemProperty.map(prop => allIdArr.push(prop.id));
                moveIt.getItemProperty(srcId).swapGroup = allIdArr;
            }
            destIdArr.map(destId => {
                const index = moveIt.getItemProperty(srcId).swapGroup.indexOf(destId);
                if (index >= 0) {
                    moveIt.getItemProperty(srcId).swapGroup.splice(index, 1);
                }
            });
            if (allIdArr === moveIt.getItemProperty(srcId).swapGroup) {
                moveIt.getItemProperty(srcId).swapGroup = undefined;
            } else {
                moveIt.getItemProperty(srcId).swapGroup.sort((a, b) => a - b);
            }
        });
    },
    getItemById: (itemId) => {
        try {
            return moveIt.getItems().filter(item => parseInt(item.getAttribute("moveit-id")) === itemId)[0];
        } catch(e) {
            return undefined;
        }
    },
    getIdByItem: (item) => {
        try {
            return parseInt(item.getAttribute("moveit-id"));
        } catch(e) {
            return undefined;
        }
    },
    swap: (itemOne, itemTwo) => {
        if (moveIt.isInGroup(itemOne) && moveIt.isInGroup(itemTwo)) {
            const temp = itemOne.outerHTML;
            itemOne.outerHTML = itemTwo.outerHTML;
            itemTwo.outerHTML = temp;
        }
    },
    holdItem: (item) => {
        moveIt.heldId = moveIt.getIdByItem(item);
        const itemProperty = moveIt.getItemProperty(moveIt.heldId);
        moveIt.heldElement = document.createElement("div");
        moveIt.heldElementPlaceholder = item.innerHTML;
        moveIt.heldElement.innerHTML = (itemProperty.elementHeld || moveIt.elementHeld) || "";
        moveIt.heldElement.setAttribute("style", itemProperty.elementHeldStyle || moveIt.elementHeldStyle);
        moveIt.heldElement.setAttribute("body-cursor", document.body.style.cursor);
        moveIt.heldElement.setAttribute("body-overflow", document.body.style.overflow);
        moveIt.heldElement.setAttribute("body-user-select", document.body.style.userSelect);
        moveIt.heldElement.setAttribute("moveit-id", moveIt.heldId);
        moveIt.heldElement.style.position = "fixed";
        moveIt.heldElement.style.zIndex = Number.MAX_SAFE_INTEGER;
        moveIt.heldElement.style.pointerEvents = "none";
        itemProperty.onHold ? itemProperty.onHold(moveIt.heldElement) : (moveIt.onHold && moveIt.onHold(moveIt.heldElement));
        document.body.style.cursor = (itemProperty.holdCursor || moveIt.holdCursor) || document.body.style.cursor;
        document.body.style.overflow = "hidden";
        document.body.style.userSelect = "none";
        document.body.appendChild(moveIt.heldElement);
    },
    releaseItem: () => {
        if (moveIt.heldElement) {
            moveIt.heldElement.style.visibility = "hidden";
            document.body.removeChild(moveIt.heldElement);
            document.body.style.overflow = moveIt.heldElement.getAttribute("body-cursor");
            document.body.style.cursor = moveIt.heldElement.getAttribute("body-overflow");
            document.body.style.userSelect = moveIt.heldElement.getAttribute("body-user-select");
            const id = moveIt.getIdByItem(moveIt.heldElement);
            moveIt.heldElement = null;
            const item = moveIt.getItemById(id);
            item.className = moveIt.heldElementClass;
            item.innerHTML = moveIt.heldElementPlaceholder;
            return id;
        }
    },
    getItemMouseOver: (e) => {
        for (let i = 0; i < e.path.length - 2; i++) {
            const attributes = e.path[i].getAttributeNames();
            if (attributes && attributes.includes("moveit-item")) {
                return e.path[i];
            }
        }
    },
};