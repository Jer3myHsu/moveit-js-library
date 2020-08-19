"use strict";

(function(global) {
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
            onHold: undefined,
            onRelease: undefined,
            onSwap: undefined,
            swapGroup: undefined
        }));
        return itemProperty;
    }
    function holdItem(item) {
        heldId = MoveIt.getIdByItem(item);
        const itemProperty = MoveIt.getItemProperty(heldId);
        heldElement = document.createElement("div");
        heldElement.innerHTML = ((itemProperty.elementHeld || MoveIt.elementHeld) || item).outerHTML;
        heldElement.setAttribute("style", itemProperty.elementHeldStyle || MoveIt.elementHeldStyle);
        heldElement.setAttribute("body-cursor", document.body.style.cursor);
        heldElement.setAttribute("body-user-select", document.body.style.userSelect);
        heldElement.setAttribute("moveit-id", heldId);
        heldElement.style.position = "fixed";
        heldElement.style.zIndex = Number.MAX_SAFE_INTEGER;
        heldElement.style.pointerEvents = "none";
        document.body.style.cursor = (itemProperty.holdCursor || MoveIt.holdCursor) || document.body.style.cursor;
        document.body.style.userSelect = "none";
        itemProperty.onHold ? itemProperty.onHold(heldElement) : (MoveIt.onHold && MoveIt.onHold(heldElement));
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
            if (attributes && attributes.includes("moveit-item") && MoveIt.getIdByItem(e.path[i]) !== heldId) {
                return e.path[i];
            }
        }
    }
    function switchItem(item, type) {
        if (type === "held") {
            const itemProperty = MoveIt.getItemProperty(heldId);
            const replaceElement = (itemProperty.elementWhenHeld || MoveIt.elementWhenHeld) || item;
            heldElementHTML = item.outerHTML;
            heldElementClass = item.cloneNode(true).className;
            replaceElement.setAttribute("moveit-id", heldId);
            replaceElement.setAttribute("moveit-item", undefined);
            if (itemProperty.elementWhenHeldStyle || MoveIt.elementWhenHeldStyle) {
                replaceElement.setAttribute("style", itemProperty.elementWhenHeldStyle || MoveIt.elementWhenHeldStyle);
            }
            item.outerHTML = replaceElement.outerHTML;
        } else if (type === "hover") {
            const itemProperty = MoveIt.getItemProperty(hoverId);
            const replaceElement = (itemProperty.elementHover || MoveIt.elementHover) || item;
            hoverElementHTML = item.outerHTML;
            hoverElementClass = item.cloneNode(true).className;
            replaceElement.setAttribute("moveit-id", hoverId);
            replaceElement.setAttribute("moveit-item", undefined);
            if (itemProperty.elementHoverStyle || MoveIt.elementHoverStyle) {
                replaceElement.setAttribute("style", itemProperty.elementHoverStyle || MoveIt.elementHoverStyle);
            }
            item.outerHTML = replaceElement.outerHTML;
        }
    }
    function restoreItem(type) {
        if (type === "held" && typeof heldId === "number") {
            const item = MoveIt.getItemById(heldId);
            item.className = heldElementClass;
            item.outerHTML = heldElementHTML;
            heldId = undefined;
            heldElementClass = undefined;
            heldElementHTML = undefined;
        } else if (type === "hover" && typeof hoverId === "number") {
            const item = MoveIt.getItemById(hoverId);
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
            if (item && typeof hoverId !== "number" && MoveIt.canDragWith(heldId, MoveIt.getIdByItem(item))) {
                hoverId = MoveIt.getIdByItem(item);
                switchItem(item, "hover");
            } else if (!item && typeof hoverId === "number") {
                restoreItem("hover");
            }
            const weight = Math.max(MoveIt.dragWeight * 5, 1);
            // If using interval with a low weight, it will lag 
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
    const MoveIt = {
        id: undefined,
        itemProperty: [],

        holdCursor: undefined,
        holdCenter: false,
        dragWeight: 0,
        elementHeld: undefined,
        elementHeldStyle: undefined,
        elementHover: undefined,
        elementHoverStyle: undefined,
        elementWhenHeld: undefined,
        elementWhenHeldStyle: undefined,
        onHold: undefined,
        onRelease: undefined,
        onSwap: undefined,
        initializeMoveIt: (id) => {
            MoveIt.id = id;
            MoveIt.itemProperty = initialItemProperty(MoveIt.getItems());
            initializeId(MoveIt.getItems());
            window.addEventListener("mousedown", function(e)  {
                if (e.button === 0) {
                    const item = getItemMouseOver(e);
                    const itemProperty = MoveIt.getItemProperty(MoveIt.getIdByItem(item));
                    if (item && (!itemProperty.swapGroup || itemProperty.swapGroup.length > 0)) {
                        holdItem(item);
                        let shiftX = MoveIt.holdCenter ? heldElement.offsetWidth / 2 : e.pageX - item.getBoundingClientRect().left;
                        let shiftY = MoveIt.holdCenter ? heldElement.offsetHeight / 2 : e.pageY - item.getBoundingClientRect().top;
                        switchItem(item, "held");
                        elementX = e.pageX - shiftX - (MoveIt.holdCenter ? document.scrollingElement.scrollLeft : 0);
                        elementY = e.pageY - shiftY - (MoveIt.holdCenter ? document.scrollingElement.scrollTop : 0);
                        if (!MoveIt.holdCenter) {
                            shiftX -= document.scrollingElement.scrollLeft;
                            shiftY -= document.scrollingElement.scrollTop;
                        }
                        heldElement.style.left = elementX + "px";
                        heldElement.style.top = elementY + "px";
                        const mouseListener = (e) => mouseMove(e, shiftX, shiftY);
                        window.addEventListener("mousemove", mouseListener);
                        window.addEventListener("mouseup", function(e) {
                            window.removeEventListener("mousemove", mouseListener);
                            const releasedItemId = releaseItem();
                            restoreItem("held");
                            const releasedItem = MoveIt.getItemById(releasedItemId);
                            const itemOver = getItemMouseOver(e);
                            const itemOverId = MoveIt.getIdByItem(itemOver)
                            typeof MoveIt.onRelease === "function" && MoveIt.onRelease(releasedItem, itemOver);
                            if (releasedItem && itemOver && releasedItemId !== itemOverId && MoveIt.canDragWith(releasedItemId, itemOverId)) {
                                typeof MoveIt.onSwap === "function" && MoveIt.onSwap(releasedItem, itemOver);
                                MoveIt.swap(releasedItem, itemOver);
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
            return getItemsHelper(MoveIt.id ? document.querySelector("#" + MoveIt.id) : document.body, []);
        },
        isInGroup: (item) => {
            const attributes = item.getAttributeNames();
            return attributes.includes("moveit-item");
        },
        canDragWith: (srcId, destId) => {
            return MoveIt.itemProperty.length > srcId && MoveIt.getItemProperty(srcId).swapGroup ?
                MoveIt.getItemProperty(srcId).swapGroup.includes(destId) && srcId !== destId : true;
        },
        getItemProperty: (itemId) => {
            return MoveIt.itemProperty.find(item => item.id === itemId);
        },
        addDraggableWith: (srcIdArr, destIdArr) => {
            const allIdArr = [];
            if (srcIdArr === undefined) {
                MoveIt.itemProperty.map(prop => allIdArr.push(prop.id));
            }
            (srcIdArr || allIdArr).map(srcId => {
                // If given id is greater than the maximum possible id, then skip it
                if (MoveIt.itemProperty.length <= srcId) {
                    return;
                }
                if(destIdArr === undefined) {
                    MoveIt.getItemProperty(srcId).swapGroup = undefined;
                } else if (MoveIt.getItemProperty(srcId).swapGroup) {
                    destIdArr.map(destId => {
                        if (!MoveIt.getItemProperty(srcId).swapGroup.includes(destId) &&
                            destId < MoveIt.itemProperty.length && destId !== srcId) {
                            MoveIt.getItemProperty(srcId).swapGroup.push(destId);
                        }
                    });
                    MoveIt.getItemProperty(srcId).swapGroup.sort((a, b) => a - b);
                }
            });
        },
        setDraggableWith: (srcIdArr, destIdArr) => {
            const allIdArr = [];
            if (srcIdArr === undefined) {
                MoveIt.itemProperty.map(prop => allIdArr.push(prop.id));
            }
            (srcIdArr || allIdArr).forEach(srcId => {
                if (MoveIt.itemProperty.length <= srcId) {
                    return;
                }
                if(destIdArr === undefined) {
                    MoveIt.getItemProperty(srcId).swapGroup = undefined;
                } else {
                    MoveIt.getItemProperty(srcId).swapGroup = JSON.parse(JSON.stringify(destIdArr));
                    MoveIt.getItemProperty(srcId).swapGroup.sort((a, b) => a - b);
                }
            });
        },
        removeDraggableWith: (srcIdArr, destIdArr) => {
            const allIdArr = [];
            if (srcIdArr === undefined) {
                MoveIt.itemProperty.map(prop => allIdArr.push(prop.id));
            }
            (srcIdArr || allIdArr).map(srcId => {
                if (MoveIt.itemProperty.length <= srcId) {
                    return;
                }
                if(destIdArr === undefined) {
                    MoveIt.getItemProperty(srcId).swapGroup = [];
                    return;
                } else if (!MoveIt.itemProperty[srcId]) {
                    const allIdArr = [];
                    MoveIt.itemProperty.map(prop => allIdArr.push(prop.id));
                    MoveIt.getItemProperty(srcId).swapGroup = allIdArr;
                }
                destIdArr.map(destId => {
                    const index = MoveIt.getItemProperty(srcId).swapGroup.indexOf(destId);
                    if (index >= 0) {
                        MoveIt.getItemProperty(srcId).swapGroup.splice(index, 1);
                    }
                });
                if (allIdArr === MoveIt.getItemProperty(srcId).swapGroup) {
                    MoveIt.getItemProperty(srcId).swapGroup = undefined;
                } else {
                    MoveIt.getItemProperty(srcId).swapGroup.sort((a, b) => a - b);
                }
            });
        },
        getItemById: (itemId) => {
            try {
                return MoveIt.getItems().filter(item => parseInt(item.getAttribute("moveit-id")) === itemId)[0];
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
            if (MoveIt.isInGroup(itemOne) && MoveIt.isInGroup(itemTwo)) {
                const one = itemOne.cloneNode(true);
                const two = itemTwo.cloneNode(true);
                itemTwo.parentElement.replaceChild(one, itemTwo);
                itemOne.parentElement.replaceChild(two, itemOne);
            }
        },
        cleanMoveIt: () => {
            const size = MoveIt.getItems().length;
            typeof MoveIt.id !== "string" && (MoveIt.id = undefined);
            typeof MoveIt.holdCursor !== "string" && (MoveIt.holdCursor = undefined);
            MoveIt.elementHeld instanceof HTMLElement || (MoveIt.elementHeld = undefined);
            typeof MoveIt.elementHeldStyle !== "string" && (MoveIt.elementHeldStyle = undefined);
            MoveIt.elementHover instanceof HTMLElement || (MoveIt.elementHover = undefined);
            typeof MoveIt.elementHoverStyle !== "string" && (MoveIt.elementHoverStyle = undefined);
            MoveIt.elementWhenHeld instanceof HTMLElement || (MoveIt.elementWhenHeld = undefined);
            typeof MoveIt.elementWhenHeldStyle !== "string" && (MoveIt.elementWhenHeldStyle = undefined);
            typeof MoveIt.holdCenter !== "boolean" && (MoveIt.holdCursor = false);
            (typeof MoveIt.dragWeight !== "number" || MoveIt < 0) && (MoveIt.dragWeight = 0);
            typeof MoveIt.onHold !== "function" && (MoveIt.onHold = undefined);
            typeof MoveIt.onRelease !== "function" && (MoveIt.onRelease = undefined);
            typeof MoveIt.onSwap !== "function" && (MoveIt.onSwap = undefined);
            if (Array.isArray(MoveIt.itemProperty)) {
                MoveIt.itemProperty = MoveIt.itemProperty.filter(itemProp => {
                    typeof itemProp.id === "number" && itemProp.id < size;
                });
                MoveIt.itemProperty = MoveIt.itemProperty.filter((itemProp, index) => MoveIt.itemProperty.indexOf(itemProp) === index);
                MoveIt.itemProperty.forEach(itemProp => {
                    typeof itemProp.holdCursor !== "string" && (itemProp.holdCursor = undefined);
                    itemProp.elementHeld instanceof HTMLElement || (itemProp.elementHeld = undefined);
                    typeof itemProp.elementHeldStyle !== "string" && (itemProp.elementHeldStyle = undefined);
                    itemProp.elementHover instanceof HTMLElement || (itemProp.elementHover = undefined);
                    typeof itemProp.elementHoverStyle !== "string" && (itemProp.elementHoverStyle = undefined);
                    itemProp.elementWhenHeld instanceof HTMLElement || (itemProp.elementWhenHeld = undefined);
                    typeof itemProp.elementWhenHeldStyle !== "string" && (itemProp.elementWhenHeldStyle = undefined);
                    typeof itemProp.onHold !== "function" && (itemProp.onHold = undefined);
                    typeof itemProp.onRelease !== "function" && (itemProp.onRelease = undefined);
                    typeof itemProp.onSwap !== "function" && (itemProp.onSwap = undefined);
                    if (Array.isArray(itemProp.swapGroup)) {
                        itemProp.swapGroup = itemProp.swapGroup.filter(itemId => {
                            typeof itemId === "number" && itemId < size && itemId !== itemProp.id;
                        });
                        itemProp.swapGroup = itemProp.swapGroup.filter((itemId, index) => itemProp.swapGroup.indexOf(itemId) === index);
                        if (itemProp.swapGroup.length < size - 1) {
                            itemProp.swapGroup.sort((a, b) => a - b);
                        } else {
                            itemProp.swapGroup = undefined;
                        }
                    } else {
                        itemProp.swapGroup = undefined;
                    }
                });
            } else {
                MoveIt.itemProperty = [];
            }
        }
    };

    global.MoveIt = global.MoveIt || MoveIt;

})(window);
