"user strict";

MoveIt.initializeMoveIt("box");

MoveIt.onHold = (item) => {
    const value = parseFloat(document.querySelector(".input").value);
    if (value !== NaN) {
        MoveIt.dragWeight = value;
        document.querySelector("pre").innerText = "MoveIt.dragWeight = " + value + ";"
    }
}