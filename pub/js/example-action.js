"user strict";

MoveIt.initializeMoveIt("box");

const textField = document.querySelector(".action").lastElementChild;

MoveIt.onHold = (heldElement) => {
    const elementText = MoveIt.getIdByItem(heldElement) === 0 ? "Soccer ball" : "Basketball";
    textField.innerText = elementText + " is being held";
}

MoveIt.onRelease = (releasedItem, itemOver) => {
    const releasedText = MoveIt.getIdByItem(releasedItem) === 0 ? "Soccer ball" : "Basketball";
    if (typeof itemOver !== "undefined") {
        const overText = MoveIt.getIdByItem(itemOver) === 0 ? "Soccer ball" : "Basketball";
        textField.innerText = releasedText + " was released over " + overText;
    } else {
        textField.innerText = releasedText + " was released";
    }
}

MoveIt.onSwap = (releasedItem, itemOver) => {
    const releasedText = MoveIt.getIdByItem(releasedItem) === 0 ? "Soccer ball" : "Basketball";
    const overText = MoveIt.getIdByItem(itemOver) === 0 ? "Soccer ball" : "Basketball";
    textField.innerText += "\n" + releasedText + " swapped with " + overText;
}
