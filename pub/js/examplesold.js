"use strict"

const log = console.log;

MoveIt.initializeMoveIt("content");

// Records can only be dragged to the empty record and delete
MoveIt.setDraggableWith(undefined, [MoveIt.getIdByItem(document.querySelector(".empty-record"))]);
MoveIt.setDraggableWith([0, MoveIt.getIdByItem(document.querySelector("#delete-button"))], []);

const placeholder = document.querySelector(".empty-record").cloneNode(true);
placeholder.removeAttribute("MoveIt-item");
placeholder.removeAttribute("MoveIt-id");

function setTurntable(record, text) {
    record.nextElementSibling.innerText = text || "No Song Playing";
    document.querySelector("#needle").style.transform = text ? "rotate(20deg)" : "rotate(0deg)";
}

function onRecordClick(event) {
    const recordPlaying = MoveIt.getItems()[0];
    const isPlaying = MoveIt.getIdByItem(recordPlaying);
    // Swap if record is playing or nothing is playing
    if (recordPlaying === event || !isPlaying) {
        const emptyRecord = MoveIt.getItemById(0);
        if (isPlaying) {
            setTurntable(recordPlaying);
        } else {
            setTurntable(emptyRecord, event.nextElementSibling.firstElementChild.innerText);
        }
        MoveIt.swap(event, emptyRecord);
    }
}

function onRecordHold(record) {
    const deleteButton = document.querySelector("#delete-button");
    deleteButton.style.visibility = "visible";
    deleteButton.style.opacity = "1";
}

function onRecordRelease(heldRecord, element) {
    const deleteButton = document.querySelector("#delete-button");
    const empty = document.querySelector(".empty-record");
    if (empty !== MoveIt.getItems()[0]) {
        onRecordSwap(heldRecord, empty);
        MoveIt.swap(heldRecord, empty);
        heldRecord = MoveIt.getItemById(MoveIt.getIdByItem(heldRecord))
    }
    if (deleteButton === element) {
        heldRecord.parentElement.parentElement.removeChild(heldRecord.parentElement);
    }
    deleteButton.style.opacity = "0";
    deleteButton.style.visibility = "hidden";
}

function onRecordSwap(heldRecord, emptyRecord) {
    // Since we set disabled empty records from being draggable, we know the heldRecord is never the empty record
    const recordPlaying = MoveIt.getItems()[0];
    // Swap if record is playing
    if (recordPlaying !== emptyRecord) {
        setTurntable(heldRecord);
    } else {
        setTurntable(emptyRecord, heldRecord.nextElementSibling.firstElementChild.innerText);
    }
}

MoveIt.elementHeldStyle = "opacity: 0.8;";
MoveIt.elementWhenHeld = placeholder;
MoveIt.onHold = onRecordHold;
MoveIt.onRelease = onRecordRelease;
MoveIt.onSwap = onRecordSwap;
MoveIt.dragWeight = 3;
MoveIt.holdCenter = false;