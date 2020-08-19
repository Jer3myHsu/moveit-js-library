"use strict";

const moveIt = {
    id: undefined,
    itemProperty: [],

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
        let heldId = undefined;
        let heldElement = undefined;
        let heldElementHTML = undefined;
        let heldElementClass = undefined;
        let hoverId = undefined;
        let hoverElementHTML = undefined;
        let hoverElementClass = undefined;
        let elementX = 0;
        let elementY = 0;
        let timer = undefined;
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
        function holdItem(item) {
            heldId = moveIt.getIdByItem(item);
            const itemProperty = moveIt.getItemProperty(heldId);
            heldElement = document.createElement("div");
            heldElement.innerHTML = ((itemProperty.elementHeld || moveIt.elementHeld) || item).outerHTML;
            heldElement.setAttribute("style", itemProperty.elementHeldStyle || moveIt.elementHeldStyle);
            heldElement.setAttribute("body-cursor", document.body.style.cursor);
            heldElement.setAttribute("body-user-select", document.body.style.userSelect);
            heldElement.setAttribute("moveit-id", heldId);
            heldElement.style.position = "fixed";
            heldElement.style.zIndex = Number.MAX_SAFE_INTEGER;
            heldElement.style.pointerEvents = "none";
            document.body.style.cursor = (itemProperty.holdCursor || moveIt.holdCursor) || document.body.style.cursor;
            document.body.style.userSelect = "none";
            itemProperty.onHold ? itemProperty.onHold(heldElement) : (moveIt.onHold && moveIt.onHold(heldElement));
            document.body.appendChild(heldElement);
        }
        function releaseItem() {
            if (heldElement) {
                heldElement.style.visibility = "hidden";
                document.body.removeChild(heldElement);
                document.body.style.cursor = heldElement.getAttribute("body-cursor");
                document.body.style.userSelect = heldElement.getAttribute("body-user-select");
                heldElement = null;
                return heldId;
            }
        }
        function getItemMouseOver(e) {
            for (let i = 0; i < e.path.length - 2; i++) {
                const attributes = e.path[i].getAttributeNames();
                if (attributes && attributes.includes("moveit-item") && moveIt.getIdByItem(e.path[i]) !== heldId) {
                    return e.path[i];
                }
            }
        }
        function switchItem(item, type) {
            if (type === "held") {
                const itemProperty = moveIt.getItemProperty(heldId);
                const replaceElement = (itemProperty.elementWhenHeld || moveIt.elementWhenHeld) || item;
                heldElementHTML = item.outerHTML;
                heldElementClass = item.cloneNode(true).className;
                replaceElement.setAttribute("moveit-id", heldId);
                replaceElement.setAttribute("moveit-item", undefined);
                if (itemProperty.elementWhenHeldStyle || moveIt.elementWhenHeldStyle) {
                    replaceElement.setAttribute("style", itemProperty.elementWhenHeldStyle || moveIt.elementWhenHeldStyle);
                }
                item.outerHTML = replaceElement.outerHTML;
            } else if (type === "hover") {
                const itemProperty = moveIt.getItemProperty(hoverId);
                const replaceElement = (itemProperty.elementHover || moveIt.elementHover) || item;
                hoverElementHTML = item.outerHTML;
                hoverElementClass = item.cloneNode(true).className;
                replaceElement.setAttribute("moveit-id", hoverId);
                replaceElement.setAttribute("moveit-item", undefined);
                if (itemProperty.elementHoverStyle || moveIt.elementHoverStyle) {
                    replaceElement.setAttribute("style", itemProperty.elementHoverStyle || moveIt.elementHoverStyle);
                }
                item.outerHTML = replaceElement.outerHTML;
            }
        }
        function restoreItem(type) {
            if (type === "held" && typeof heldId === "number") {
                const item = moveIt.getItemById(heldId);
                item.className = heldElementClass;
                item.outerHTML = heldElementHTML;
                heldId = undefined;
                heldElementClass = undefined;
                heldElementHTML = undefined;
            } else if (type === "hover" && typeof hoverId === "number") {
                const item = moveIt.getItemById(hoverId);
                item.className = hoverElementClass;
                item.outerHTML = hoverElementHTML;
                hoverId = undefined;
                hoverElementClass = undefined;
                hoverElementHTML = undefined;
            }
        }
        function mouseMove(e, shiftX, shiftY) {
            if (heldElement) {
                const move = (posX, posY, weight) => {
                    posX -= document.scrollingElement.scrollLeft;
                    posY -= document.scrollingElement.scrollTop;
                    elementX = ((weight - 1) * elementX + posX) / weight;
                    elementY = ((weight - 1) * elementY + posY) / weight;
                    heldElement.style.left = elementX + "px";
                    heldElement.style.top = elementY + "px";
                };
                const item = getItemMouseOver(e);
                if (item && typeof hoverId !== "number" && moveIt.canDragWith(heldId, moveIt.getIdByItem(item))) {
                    hoverId = moveIt.getIdByItem(item);
                    switchItem(item, "hover");
                } else if (!item && typeof hoverId === "number") {
                    restoreItem("hover");
                }
                const weight = Math.max(moveIt.dragWeight * 5, 1);
                // If using interval with a low weight will lag 
                if (weight > 2) {
                    clearInterval(timer);
                    timer = setInterval(() => {
                        if (heldElement && Math.abs(elementX - e.pageX + shiftX) > 0.2 && Math.abs(elementY - e.pageY + shiftY) > 0.2) {
                            move(e.pageX - shiftX, e.pageY - shiftY, weight);
                        } else {
                            clearInterval(timer);
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
                const item = getItemMouseOver(e);
                const itemProperty = moveIt.getItemProperty(moveIt.getIdByItem(item));
                if (item && (!itemProperty.swapGroup || itemProperty.swapGroup.length > 0)) {
                    holdItem(item);
                    let shiftX = moveIt.holdCenter ? heldElement.offsetWidth / 2 : e.pageX - item.getBoundingClientRect().left - document.scrollingElement.scrollLeft;
                    let shiftY = moveIt.holdCenter ? heldElement.offsetHeight / 2 : e.pageY - item.getBoundingClientRect().top - document.scrollingElement.scrollTop;
                    switchItem(item, "held");
                    elementX = e.pageX - shiftX - (moveIt.holdCenter ? document.scrollingElement.scrollLeft : 0);
                    elementY = e.pageY - shiftY - (moveIt.holdCenter ? document.scrollingElement.scrollTop : 0);
                    heldElement.style.left = elementX + "px";
                    heldElement.style.top = elementY + "px";
                    const mouseListener = (e) => mouseMove(e, shiftX, shiftY);
                    window.addEventListener("mousemove", mouseListener);
                    window.addEventListener("mouseup", function(e) {
                        window.removeEventListener("mousemove", mouseListener);
                        const releasedItemId = releaseItem();
                        restoreItem("held");
                        const releasedItem = moveIt.getItemById(releasedItemId);
                        const itemOver = getItemMouseOver(e);
                        const itemOverId = moveIt.getIdByItem(itemOver)
                        typeof moveIt.onRelease === "function" && moveIt.onRelease(releasedItem, itemOver);
                        if (releasedItem && itemOver && releasedItemId !== itemOverId && moveIt.canDragWith(releasedItemId, itemOverId)) {
                            typeof moveIt.onSwap === "function" && moveIt.onSwap(releasedItem, itemOver);
                            moveIt.swap(releasedItem, itemOver);
                        }
                        restoreItem("hover");//Must restore at the end since losing parent will cause swap issue
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
                moveIt.getItemProperty(srcId).swapGroup = JSON.parse(JSON.stringify(destIdArr));
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
    }
};