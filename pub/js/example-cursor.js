"user strict";

MoveIt.initializeMoveIt("box");

function radioClick(e) {
    MoveIt.holdCursor = e.value;
    document.querySelector("pre").innerText = "MoveIt.holdCursor = '" + e.value + "';"
}