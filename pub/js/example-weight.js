"user strict";

MoveIt.initializeMoveIt();

function inputChange(item) {
    const value = parseFloat(item.value);
    if (value !== NaN) {
        MoveIt.dragWeight = value;
        document.querySelector("code").innerText = "MoveIt.dragWeight = " + value + ";"
    }
}