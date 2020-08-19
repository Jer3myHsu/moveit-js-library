moveIt.initializeMoveIt("box");

moveIt.setDraggableWith([0,1,2,3,4,5], []);
moveIt.addDraggableWith([1,2,3,4,5], [0]);
moveIt.addDraggableWith([2,3,4,5], [1]);
moveIt.addDraggableWith([3,4,5], [2]);
moveIt.addDraggableWith([4,5], [3]);
moveIt.addDraggableWith([5], [4]);

moveIt.setDraggableWith([6,8,10], [6,8,10]);
moveIt.setDraggableWith([7,9,11], [7,9,11]);
