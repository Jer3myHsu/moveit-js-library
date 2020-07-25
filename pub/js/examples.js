"use strict"

const log = console.log;

moveIt.initializeMoveIt("content", "group-item");

// Records can only be dragged to the empty record and delete
moveIt.setDraggableWith(undefined, [moveIt.getIdByItem(document.querySelector(".empty-record"))]);
moveIt.setDraggableWith([0, moveIt.getIdByItem(document.querySelector("#delete-button"))], []);

function setTurntable(record, text) {
    record.nextElementSibling.innerText = text || "No Song Playing";
    document.querySelector("#needle").style.transform = text ? "rotate(20deg)" : "rotate(0deg)";
}

function onRecordClick(event) {
    const recordPlaying = moveIt.getItems()[0];
    const isPlaying = moveIt.getIdByItem(recordPlaying);
    // Swap if record is playing or nothing is playing
    if (recordPlaying === event || !isPlaying) {
        const emptyRecord = moveIt.getItemById(0);
        if (isPlaying) {
            setTurntable(recordPlaying);
        } else {
            setTurntable(emptyRecord, event.nextElementSibling.firstElementChild.innerText);
        }
        moveIt.swap(event, emptyRecord);
    }
}

function onEmptyRecordClick(event) {
    const recordPlaying = moveIt.getItems()[0];
    // Swap something is playing
    if (event !== recordPlaying) {
        setTurntable(recordPlaying);
        moveIt.swap(event, recordPlaying);
    }
}

function onRecordHold(record) {
    const deleteButton = document.querySelector("#delete-button");
    deleteButton.style.visibility = "visible";
    deleteButton.style.opacity = "1";
    record.style.opacity = 0.8;
}

function onRecordRelease(heldRecord, element) {
    const deleteButton = document.querySelector("#delete-button");
    if (deleteButton === element) {
        heldRecord.parentElement.parentElement.removeChild(heldRecord.parentElement);
    }
    deleteButton.style.opacity = "0";
    deleteButton.style.visibility = "hidden";
}

function onRecordSwap(heldRecord, emptyRecord) {
    // Since we set disabled empty records from being draggable, we know the heldRecord is never the empty record
    const recordPlaying = moveIt.getItems()[0];
    // Swap if record is playing
    if (recordPlaying !== emptyRecord) {
        setTurntable(heldRecord);
    } else {
        setTurntable(emptyRecord, heldRecord.nextElementSibling.firstElementChild.innerText);
    }
}

moveIt.onHold = onRecordHold;
moveIt.onRelease = onRecordRelease;
moveIt.onSwap = onRecordSwap;