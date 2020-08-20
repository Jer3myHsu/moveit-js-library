"user strict";

MoveIt.initializeMoveIt();

function radioClick(e) {
    MoveIt.holdCursor = e.value;
    document.querySelector("code").innerText = "MoveIt.holdCursor = '" + e.value + "';"
}