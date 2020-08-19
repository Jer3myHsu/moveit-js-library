"user strict";

moveIt.initializeMoveIt("box");

moveIt.onHold = (item) => {
    const value = parseFloat(document.querySelector(".input").value);
    if (value !== NaN) {
        moveIt.dragWeight = value;
        document.querySelector("pre").innerText = "moveIt.dragWeight = " + value + ";"
    }
}