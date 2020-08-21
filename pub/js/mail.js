"user strict";

MoveIt.initializeMoveIt();

MoveIt.getItems().forEach(item => {
    const id = MoveIt.getIdByItem(item);
    MoveIt.setDraggableWith([id], [id]);
});

MoveIt.setDraggableWith([MoveIt.getItems().length - 1], []);
MoveIt.setDraggableWith([0,1,2,3,4],[0,1,2,3,4]);

MoveIt.itemProperty.forEach(itemProp => {
    if (itemProp.id <= 4) {
        const img = MoveIt.getItemById(itemProp.id).cloneNode(true).firstElementChild;
        img.style.padding ="10px";
        img.style.backgroundColor = "gray";
        img.style.borderRadius = "50%";
        itemProp.elementHeld = img;
        itemProp.elementHoverStyle = "background-color: #333333;";
    } else if (itemProp.id !== MoveIt.itemProperty.length - 1) {
        const text = document.createElement("h3");
        text.innerText = MoveIt.getItemById(itemProp.id).children[1].innerText;
        text.style.padding ="10px";
        text.style.color = "white";
        text.style.backgroundColor = "gray";
        text.style.borderRadius = "20px";
        itemProp.elementHeld = text;
        itemProp.onHold = (item) => {
            MoveIt.getItems().slice(-1)[0].style.bottom = "10px";
        };
        itemProp.onRelease = (releasedItem, itemOver) => {
            if (MoveIt.getIdByItem(itemOver) === MoveIt.itemProperty.length - 1) {
                releasedItem.parentElement.removeChild(releasedItem);
            }
            MoveIt.getItems().slice(-1)[0].style.bottom = "-50px";
        };
    }
});

MoveIt.elementOriginStyle = "filter: blur(2px); opacity: 0.3;";

MoveIt.dragWeight = 2;
MoveIt.holdCursor = "grabbing";
MoveIt.holdCenter = true;