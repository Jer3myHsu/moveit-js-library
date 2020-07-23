"use strict";

const moveIt = {
    id: undefined,
    itemClassName: undefined,
    getItems: undefined,
    dragProperty: [],
    heldElement: undefined,
    initializeMoveIT: (groupId, itemClassName) => {
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
        function initializeId(items) {
            for (let i = 0; i < items.length; i++) {
                items[i].setAttribute("moveIt-id", i);
            }
        }
        function initialDragProperty(items) {
            const dragProperty = [];
            items.map(item => dragProperty.push(undefined));
            return dragProperty;
        }
        moveIt.id = groupId;
        moveIt.itemClassName = itemClassName;
        moveIt.getItems = () => getItems(document.querySelector("#" + groupId), itemClassName, []);
        moveIt.dragProperty = initialDragProperty(moveIt.getItems());
        initializeId(moveIt.getItems());
        window.addEventListener("mousemove", function(e) {
            if (moveIt.heldElement) {
                moveIt.heldElement.style.visibility = "visible";
                const left = e.pageX - moveIt.heldElement.clientWidth / 2;
                const top = e.pageY - moveIt.heldElement.clientHeight / 2;
                moveIt.heldElement.style.left = left + "px";
                moveIt.heldElement.style.top = top + "px";
            }
        });
        window.addEventListener("mousedown", function(e) {
            const item = moveIt.getItemMouseOver(e);
            if (item && moveIt.getDragWith(moveIt.getIdByItem(item)).length > 0) {
                moveIt.holdItem(item);
            }
        });
        window.addEventListener("mouseup", function(e) {
            const releasedItemId = moveIt.releaseItem();
            const releasedItem = moveIt.getItemById(releasedItemId);
            const itemOver = moveIt.getItemMouseOver(e);
            if (releasedItem && itemOver && itemOver !== releasedItem && moveIt.canDragWith(releasedItemId,
                moveIt.getIdByItem(itemOver))) {
                moveIt.swap(itemOver, releasedItem);
            }
        });
    },
    isInGroup: (item) => {
        const classes = item.className.split(" ");
        return classes.includes(moveIt.itemClassName);
    },
    canDragWith: (srcId, destId) => {
        return moveIt.dragProperty.length > srcId && moveIt.dragProperty[srcId] ?
            moveIt.dragProperty[srcId].includes(destId) : true;
    },
    getDragWith: (itemId) => {
        const newProps = [];
        if (moveIt.dragProperty[itemId]) {
            moveIt.dragProperty[itemId].map(id => {
                if (id < moveIt.dragProperty.length && id >= 0 && id !== itemId) {
                    newProps.push(id);
                }
            });
            newProps.sort((a, b) => a - b);
            moveIt.dragProperty[itemId] = newProps;
        } else {
            moveIt.dragProperty.map((prop, i) => i !== itemId && newProps.push(i));
        }
        return newProps;
    },
    addDraggableWith: (srcIdArr, destIdArr) => {
        const allIdArr = [];
        if (srcIdArr === undefined) {
            moveIt.dragProperty.map((prop, i) => allIdArr.push(i));
        }
        (srcIdArr || allIdArr).map(srcId => {
            if (moveIt.dragProperty.length <= srcId) {
                return;
            }
            if(destIdArr === undefined) {
                moveIt.dragProperty[srcId] = undefined;
            } else if (moveIt.dragProperty[srcId]) {
                destIdArr.map(destId => {
                    if (!moveIt.dragProperty[srcId].includes(destId) &&
                        destId < moveIt.dragProperty.length && destId !== srcId) {
                        moveIt.dragProperty[srcId].push(destId);
                    }
                });
                moveIt.dragProperty[srcId].sort((a, b) => a - b);
            }
        });
    },
    setDraggableWith: (srcIdArr, destIdArr) => {
        const allIdArr = [];
        if (srcIdArr === undefined) {
            moveIt.dragProperty.map((prop, i) => allIdArr.push(i));
        }
        (srcIdArr || allIdArr).map(srcId => {
            if (moveIt.dragProperty.length <= srcId) {
                return;
            }
            if(destIdArr === undefined) {
                moveIt.dragProperty[srcId] = undefined;
            } else {
                moveIt.dragProperty[srcId] = destIdArr;
                moveIt.dragProperty[srcId].sort((a, b) => a - b);
            }
        });
    },
    removeDraggableWith: (srcIdArr, destIdArr) => {
        const allIdArr = [];
        if (srcIdArr === undefined) {
            moveIt.dragProperty.map((prop, i) => allIdArr.push(i));
        }
        (srcIdArr || allIdArr).map(srcId => {
            if (moveIt.dragProperty.length <= srcId) {
                return;
            }
            if(destIdArr === undefined) {
                moveIt.dragProperty[srcId] = [];
                return;
            } else if (!moveIt.dragProperty[srcId]) {
                const allIdArr = [];
                moveIt.dragProperty.map((prop, i) => allIdArr.push(i));
                moveIt.dragProperty[srcId] = allIdArr;
            }
            destIdArr.map(destId => {
                const index = moveIt.dragProperty[srcId].indexOf(destId);
                if (index >= 0) {
                    moveIt.dragProperty[srcId].splice(index, 1);
                }
            });
            if (allIdArr === moveIt.dragProperty[srcId]) {
                moveIt.dragProperty[srcId] = undefined;
            } else {
                moveIt.dragProperty[srcId].sort((a, b) => a - b);
            }
        });
    },
    getItemById: (itemId) => {
        try {
            return moveIt.getItems().filter(item => parseInt(item.getAttribute("moveIt-id")) === itemId)[0];
        } catch(e) {
            return undefined;
        }
    },
    getIdByItem: (item) => {
        try {
            return parseInt(item.getAttribute("moveIt-id"));
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
    holdItem: (item, element) => {
        moveIt.heldElement = document.createElement("div");
        moveIt.heldElement.innerHTML = element ? element.outerHTML : item.outerHTML;
        moveIt.heldElement.setAttribute("body-cursor", document.body.style.cursor);
        moveIt.heldElement.setAttribute("body-overflow", document.body.style.overflow);
        moveIt.heldElement.setAttribute("body-user-select", document.body.style.userSelect);
        moveIt.heldElement.setAttribute("moveIt-id", moveIt.getIdByItem(item));
        moveIt.heldElement.style.position = "absolute";
        moveIt.heldElement.style.zIndex = Number.MAX_SAFE_INTEGER;
        moveIt.heldElement.style.pointerEvents = "none";
        moveIt.heldElement.style.visibility = "hidden";
        document.body.style.cursor = "grabbing";
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
            return id;
        }
    },
    getItemMouseOver: (e) => {
        for (let i = 0; i < e.path.length; i++) {
            const classes = e.path[i].className;
            if (classes && classes.split(" ").includes(moveIt.itemClassName)) {
                return e.path[i];
            }
        }
    },
};