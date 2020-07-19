"use strict";

const log = console.log;
let movingElement = null;
let toMove = null;
const groups = [];

function createGroup(groupId, itemClassName) {
    function Group(groupId, itemClassName) {
        this.id = groupId;
        this.itemClassName = itemClassName;
        this.HTML = () => document.querySelector("#" + this.id);
        this.items = () => getItemsByClassName(this.HTML(), this.itemClassName);
    }
    groups.push(new Group(groupId, itemClassName));
}

function getGroupByItemClass(itemClassName) {
    return groups.filter(group => group.itemClassName === itemClassName)[0];
}

function getGroupsByItem(item) {
    const classes = item.className.split(" ");
    return groups.filter(group => classes.includes(group.itemClassName));
}

function getGroupById(groupId) {
    return groups.filter(group => group.id === groupId)[0];
}

function getItemsByClassName(groupHTML, className) {
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
    }
    const items = [];
    getItems(groupHTML, className, items);
    return items;
}

function swap(itemOne, itemTwo) {
    const temp = itemOne.outerHTML;
    itemOne.outerHTML = itemTwo.outerHTML;
    itemTwo.outerHTML = temp;
}

function holdItem(item) {
        movingElement = document.createElement(item.tagName);
        toMove = item;
        movingElement.innerHTML = item.outerHTML;
        movingElement.style.position = "absolute";
        
        movingElement.style["z-index"] = Number.MAX_SAFE_INTEGER;// other notation has issue with hyphen
        movingElement.style["pointer-events"] = "none";
        movingElement.style.visibility = "hidden";
        document.body.style.cursor = "grabbing";
        document.body.style.overflow = "hidden";
        document.body.style["user-select"] = "none";
        document.body.appendChild(movingElement);
}

function releaseItem() {
    if (movingElement) {
        movingElement.style.visibility = "hidden";
        document.body.removeChild(movingElement);
        const temp = movingElement.firstElementChild;
        movingElement = null;
        document.body.style = null;
        document.body.style.overflow = "auto";
        document.body.style.cursor = "auto";
        document.body.style["user-select"] = "auto";
        return temp;
    }
}

function getItemMouseOver(e) {
    for (let i = 0; i < e.path.length; i++) {
        const classNames = groups.map(group => group.itemClassName);
        for (let j = 0; j < classNames.length; j++) {
            const classes = e.path[i].className;
            if (classes && classes.split(" ").includes(classNames[j])) {
                return e.path[i];
            }
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
    releaseItem();
    const item = getItemMouseOver(e);
    if (item && item !== toMove) {
        swap(item, toMove);
    }
});