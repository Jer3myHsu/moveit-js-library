MoveIt.initializeMoveIt();

MoveIt.setDraggableWith([0,1,2,3,4,5], []);
MoveIt.addDraggableWith([1,2,3,4,5], [0]);
MoveIt.addDraggableWith([2,3,4,5], [1]);
MoveIt.addDraggableWith([3,4,5], [2]);
MoveIt.addDraggableWith([4,5], [3]);
MoveIt.addDraggableWith([5], [4]);

MoveIt.setDraggableWith([6,8,10], [6,8,10]);
MoveIt.setDraggableWith([7,9,11], [7,9,11]);
