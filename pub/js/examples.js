"use strict"


const log = console.log;//REMOVE ME

initializeGroup("content", "group-item");

// Records can only be dragged to the empty record
setDraggableWith(undefined, [getIdByItem(document.querySelector(".empty-record"))]);

function onRecordClick(event) {
    const recordPlaying = moveIt.getItems()[0];
    const isPlaying = getIdByItem(recordPlaying);
    // Swap if record is playing or nothing is playing
    if (recordPlaying === event || !isPlaying) {
        const emptyRecord = getItemById(0);
        if (isPlaying) {
            recordPlaying.nextElementSibling.innerText = "No Song";
            document.querySelector("#needle-playing").id = "needle-idle";
        } else {
            emptyRecord.nextElementSibling.innerText = event.nextElementSibling.firstElementChild.innerText;
            document.querySelector("#needle-idle").id = "needle-playing";
        }
        swap(event, emptyRecord);
    }
}

function onEmptyRecordClick(event) {
    const recordPlaying = moveIt.getItems()[0];
    // Swap something is playing
    if (event !== recordPlaying) {
        recordPlaying.nextElementSibling.innerText = "No Song";
        document.querySelector("#needle-playing").id = "needle-idle";
        swap(event, recordPlaying);
    }
}