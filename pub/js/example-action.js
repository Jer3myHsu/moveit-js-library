"user strict";

moveIt.initializeMoveIt("box");

const textField = document.querySelector(".action").lastElementChild;

moveIt.onHold = (heldElement) => {
    const elementText = moveIt.getIdByItem(heldElement) === 0 ? "Soccer ball" : "Basketball";
    textField.innerText = elementText + " is being held";
}

moveIt.onRelease = (releasedItem, itemOver) => {
    const releasedText = moveIt.getIdByItem(releasedItem) === 0 ? "Soccer ball" : "Basketball";
    if (typeof itemOver !== "undefined") {
        const overText = moveIt.getIdByItem(itemOver) === 0 ? "Soccer ball" : "Basketball";
        textField.innerText = releasedText + " was released over " + overText;
    } else {
        textField.innerText = releasedText + " was released";
    }
}

moveIt.onSwap = (releasedItem, itemOver) => {
    const releasedText = moveIt.getIdByItem(releasedItem) === 0 ? "Soccer ball" : "Basketball";
    const overText = moveIt.getIdByItem(itemOver) === 0 ? "Soccer ball" : "Basketball";
    textField.innerText += "\n" + releasedText + " swapped with " + overText;
}
