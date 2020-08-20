"use strict";

MoveIt.initializeMoveIt();

MoveIt.setDraggableWith([0,1],[0,1]);
MoveIt.setDraggableWith([2,3],[2,3]);
MoveIt.setDraggableWith([4,5,6],[4,5,6]);
MoveIt.setDraggableWith([7,8],[7,8]);
MoveIt.setDraggableWith([9,10],[9,10]);

const itemOneProp = MoveIt.getItemProperty(2);
itemOneProp.elementHoverStyle = "visibility: hidden;";
itemOneProp.elementOriginStyle = "visibility: hidden;";

const itemTwoProp = MoveIt.getItemProperty(3);
itemTwoProp.elementHoverStyle = "opacity: 0;";
itemTwoProp.elementOriginStyle = "visibility: hidden;";

const itemThreeProp = MoveIt.getItemProperty(4);
const hoverThree = document.createElement("div");
hoverThree.style.height = "84px";
hoverThree.style.width = "104px";
hoverThree.style.backgroundColor = "gray";
itemThreeProp.elementHover = hoverThree;
const originThree = document.createElement("div");
originThree.style.height = "84px";
originThree.style.width = "104px";
originThree.style.backgroundColor = "gray";
itemThreeProp.elementOrigin = originThree;

const itemFourProp = MoveIt.getItemProperty(5);
const hoverFour = document.createElement("div");
hoverFour.style.height = "84px";
hoverFour.style.width = "104px";
hoverFour.style.margin = "20px 30px";
hoverFour.style.backgroundColor = "gray";
itemFourProp.elementHover = hoverFour;
const originFour = document.createElement("div");
originFour.style.height = "84px";
originFour.style.width = "104px";
originFour.style.backgroundColor = "gray";
originFour.style.margin = "20px 30px";
itemFourProp.elementOrigin = originFour;

const itemFiveProp = MoveIt.getItemProperty(6);
const hoverFive = document.createElement("div");
hoverFive.style.height = "84px";
hoverFive.style.width = "104px";
hoverFive.style.borderColor = "white";
hoverFive.style.borderStyle = "solid";
hoverFive.style.borderWidth = "20px 30px";
hoverFive.style.backgroundColor = "gray";
itemFiveProp.elementHover = hoverFive;
const originFive = document.createElement("div");
originFive.style.height = "84px";
originFive.style.width = "104px";
originFive.style.backgroundColor = "gray";
originFive.style.margin = "20px 30px";
itemFiveProp.elementOrigin = originFive;

const itemSixProp = MoveIt.getItemProperty(7);
const heldSix = document.createElement("div");
heldSix.style.height = "50px";
heldSix.style.width = "50px";
heldSix.style.backgroundColor = "red";
itemSixProp.elementHeld = heldSix;

const itemSevenProp = MoveIt.getItemProperty(8);
const heldSeven = document.createElement("div");
heldSeven.style.height = "50px";
heldSeven.style.width = "50px";
heldSeven.style.backgroundColor = "red";
itemSevenProp.elementHeld = heldSeven;
itemSevenProp.holdCenter = true;

const itemEightProp = MoveIt.getItemProperty(9);
const heldEight = MoveIt.getItemById(9);
heldEight.style.backgroundColor = "red";
itemEightProp.elementHeld = heldEight;

const itemNineProp = MoveIt.getItemProperty(10);
const heldNine =  MoveIt.getItemById(10).cloneNode(true);
heldNine.style.backgroundColor = "red";
itemNineProp.elementHeld = heldNine;