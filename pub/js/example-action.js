"user strict";

MoveIt.initializeMoveIt();

MoveIt.setDraggableWith([0,1],[0,1]);
MoveIt.removeDraggableWith([2], undefined);
MoveIt.setDraggableWith([3,4,5,6],[3,4,5,6]);

const textField = document.querySelector(".action").lastElementChild;
MoveIt.itemProperty.forEach(itemProp => {
    if (itemProp.id <= 1) {
        itemProp.onHold = (heldElement) => {
            const elementText = MoveIt.getIdByItem(heldElement) === 0 ? "Soccer ball" : "Basketball";
            textField.innerText = elementText + " is being held";
        }

        itemProp.onRelease = (releasedItem, itemOver) => {
            const releasedText = MoveIt.getIdByItem(releasedItem) === 0 ? "Soccer ball" : "Basketball";
            if (typeof itemOver !== "undefined") {
                const overText = MoveIt.getIdByItem(itemOver) === 0 ? "Soccer ball" : "Basketball";
                textField.innerText = releasedText + " was released over " + overText;
            } else {
                textField.innerText = releasedText + " was released";
            }
        }

        itemProp.onSwap = (releasedItem, itemOver) => {
            const releasedText = MoveIt.getIdByItem(releasedItem) === 0 ? "Soccer ball" : "Basketball";
            const overText = MoveIt.getIdByItem(itemOver) === 0 ? "Soccer ball" : "Basketball";
            textField.innerText += "\n" + releasedText + " swapped with " + overText;
        }
    } else {
        itemProp.onRelease = (releasedItem, itemOver) => {
            if (MoveIt.getIdByItem(itemOver) === 2) {
                releasedItem.parentElement.removeChild(releasedItem);
            }
        };
    }
});
