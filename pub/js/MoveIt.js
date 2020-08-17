"use strict";

const moveIt = {
    id: undefined,
    itemProperty: [],
    heldId: undefined,
    heldElement: undefined,
    heldElementHTML: undefined,
    heldElementClass: undefined,
    hoverId: undefined,
    hoverElementHTML: undefined,
    hoverElementClass: undefined,
    x: 0,
    y: 0,
    timer: undefined,

    holdCursor: undefined,
    elementHeld: undefined,
    elementHeldStyle: undefined,
    elementHover: undefined,
    elementHoverStyle: undefined,
    elementWhenHeld: undefined,
    elementWhenHeldStyle: undefined,
    holdCenter: false,
    dragWeight: 0,
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
                const move = (posX, posY, weight) => {
                    moveIt.x = ((weight - 1) * moveIt.x + posX) / weight;
                    moveIt.y = ((weight - 1) * moveIt.y + posY) / weight;
                    moveIt.heldElement.style.left = moveIt.x + "px";
                    moveIt.heldElement.style.top = moveIt.y + "px";
                };
                const item = moveIt.getItemMouseOver(e);
                if (item && typeof moveIt.hoverId !== "number") {
                    moveIt.hoverId = moveIt.getIdByItem(item);
                    moveIt.switchItem(item, "hover");
                } else if (!item && typeof moveIt.hoverId === "number") {
                    moveIt.restoreItem("hover");
                }
                const weight = Math.max(moveIt.dragWeight * 5, 1);
                // If using interval with a low weight will lag 
                if (weight > 2) {
                    clearInterval(moveIt.timer);
                    moveIt.timer = setInterval(() => {
                        if (moveIt.heldElement && Math.abs(moveIt.x - e.pageX + shiftX) > 0.1 && Math.abs(moveIt.y - e.pageY + shiftY) > 0.1) {
                            move(e.pageX - shiftX, e.pageY - shiftY, weight);
                        } else {
                            clearInterval(moveIt.timer);
                        }
                    },5);
                } else {
                    move(e.pageX - shiftX, e.pageY - shiftY, weight);
                }
            }
        }
        moveIt.id = id;
        moveIt.itemProperty = initialItemProperty(moveIt.getItems());
        initializeId(moveIt.getItems());
        window.addEventListener("mousedown", function(e)  {
            if (e.button === 0) {
                const item = moveIt.getItemMouseOver(e);
                const itemProperty = moveIt.getItemProperty(moveIt.getIdByItem(item));
                if (item && (!itemProperty.swapGroup || itemProperty.swapGroup.length > 0)) {
                    moveIt.holdItem(item);
                    const shiftX = moveIt.holdCenter ? moveIt.heldElement.offsetWidth / 2 : e.pageX - item.getBoundingClientRect().left;
                    const shiftY = moveIt.holdCenter ? moveIt.heldElement.offsetHeight / 2 : e.pageY - item.getBoundingClientRect().top;
                    moveIt.switchItem(item, "held");
                    moveIt.x = e.pageX - shiftX;
                    moveIt.y = e.pageY - shiftY;
                    moveIt.heldElement.style.left = moveIt.x + "px";
                    moveIt.heldElement.style.top = moveIt.y + "px";
                    const mouseListener = (e) => mouseMove(e, shiftX, shiftY);
                    window.addEventListener("mousemove", mouseListener);
                    window.addEventListener("mouseup", function(e) {
                        window.removeEventListener("mousemove", mouseListener);
                        const releasedItemId = moveIt.releaseItem();
                        moveIt.restoreItem("held");
                        const releasedItem = moveIt.getItemById(releasedItemId);
                        const itemOver = moveIt.getItemMouseOver(e);
                        typeof moveIt.onRelease === "function" && moveIt.onRelease(releasedItem, itemOver);
                        if (releasedItem && itemOver && moveIt.canDragWith(releasedItemId,
                            moveIt.getIdByItem(itemOver))) {
                            typeof moveIt.onSwap === "function" && moveIt.onSwap(releasedItem, itemOver);
                            moveIt.swap(releasedItem, itemOver);
                        }
                        moveIt.restoreItem("hover");//Must restore at the end since losing parent will cause swap issue
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
            moveIt.getItemProperty(srcId).swapGroup.includes(destId) && srcId !== destId : true;
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
            const one = itemOne.cloneNode(true);
            const two = itemTwo.cloneNode(true);
            itemTwo.parentElement.replaceChild(one, itemTwo);
            itemOne.parentElement.replaceChild(two, itemOne);
        }
    },
    holdItem: (item) => {
        moveIt.heldId = moveIt.getIdByItem(item);
        const itemProperty = moveIt.getItemProperty(moveIt.heldId);
        moveIt.heldElement = document.createElement("div");
        moveIt.heldElement.innerHTML = ((itemProperty.elementHeld || moveIt.elementHeld) || item).outerHTML;
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
            moveIt.heldElement = null;
            return moveIt.heldId;
        }
    },
    getItemMouseOver: (e) => {
        for (let i = 0; i < e.path.length - 2; i++) {
            const attributes = e.path[i].getAttributeNames();
            if (attributes && attributes.includes("moveit-item") && moveIt.getIdByItem(e.path[i]) !== moveIt.heldId) {
                return e.path[i];
            }
        }
    },
    switchItem: (item, type) => {
        if (type === "held") {
            const itemProperty = moveIt.getItemProperty(moveIt.heldId);
            const replaceElement = (itemProperty.elementWhenHeld || moveIt.elementWhenHeld) || item;
            moveIt.heldElementHTML = item.outerHTML;
            moveIt.heldElementClass = item.cloneNode(true).className;
            replaceElement.setAttribute("moveit-id", moveIt.heldId);
            replaceElement.setAttribute("moveit-item", undefined);
            replaceElement.setAttribute("style", itemProperty.elementWhenHeldStyle || moveIt.elementWhenHeldStyle);
            item.outerHTML = replaceElement.outerHTML;
        } else if (type === "hover") {
            const itemProperty = moveIt.getItemProperty(moveIt.hoverId);
            const replaceElement = (itemProperty.elementHover || moveIt.elementHover) || item;
            moveIt.hoverElementHTML = item.outerHTML;
            moveIt.hoverElementClass = item.cloneNode(true).className;
            replaceElement.setAttribute("moveit-id", moveIt.hoverId);
            replaceElement.setAttribute("moveit-item", undefined);
            replaceElement.setAttribute("style", itemProperty.elementHoverStyle || moveIt.elementHoverStyle);
            item.outerHTML = replaceElement.outerHTML;
        }
    },
    restoreItem: (type) => {
        if (type === "held" && typeof moveIt.heldId === "number") {
            const item = moveIt.getItemById(moveIt.heldId);
            item.className = moveIt.heldElementClass;
            item.outerHTML = moveIt.heldElementHTML;
            moveIt.heldId = undefined;
            moveIt.heldElementClass = undefined;
            moveIt.heldElementHTML = undefined;
        } else if (type === "hover" && typeof moveIt.hoverId === "number") {
            const item = moveIt.getItemById(moveIt.hoverId);
            item.className = moveIt.hoverElementClass;
            item.outerHTML = moveIt.hoverElementHTML;
            moveIt.hoverId = undefined;
            moveIt.hoverElementClass = undefined;
            moveIt.hoverElementHTML = undefined;
        }
    }
};