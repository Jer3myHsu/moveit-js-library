"use strict"


const log = console.log;//REMOVE ME

moveIt.initializeGroup("content", "group-item");

// Records can only be dragged to the empty record
moveIt.setDraggableWith(undefined, [moveIt.getIdByItem(document.querySelector(".empty-record"))]);

function onRecordClick(event) {
    const recordPlaying = moveIt.getItems()[0];
    const isPlaying = moveIt.getIdByItem(recordPlaying);
    // Swap if record is playing or nothing is playing
    if (recordPlaying === event || !isPlaying) {
        const emptyRecord = moveIt.getItemById(0);
        if (isPlaying) {
            recordPlaying.nextElementSibling.innerText = "No Song";
            document.querySelector("#needle-playing").id = "needle-idle";
        } else {
            emptyRecord.nextElementSibling.innerText = event.nextElementSibling.firstElementChild.innerText;
            document.querySelector("#needle-idle").id = "needle-playing";
        }
        moveIt.swap(event, emptyRecord);
    }
}

function onEmptyRecordClick(event) {
    const recordPlaying = moveIt.getItems()[0];
    // Swap something is playing
    if (event !== recordPlaying) {
        recordPlaying.nextElementSibling.innerText = "No Song";
        document.querySelector("#needle-playing").id = "needle-idle";
        moveIt.swap(event, recordPlaying);
    }
}