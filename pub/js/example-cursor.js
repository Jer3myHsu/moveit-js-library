"user strict";

moveIt.initializeMoveIt("box");

function radioClick(e) {
    moveIt.holdCursor = e.value;
    document.querySelector("pre").innerText = "moveIt.holdCursor = '" + e.value + "';"
}