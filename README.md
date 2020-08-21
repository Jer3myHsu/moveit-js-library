# <img src="/pub/image/logo.svg" height="64px">

Link to landing page: https://moveit-js.herokuapp.com/

## Introduction
MoveIt.js allows developers to swap element positions with other elements on the viewport. Elements can be swapped by dragging or by calling a function. Developers can choose which elements can be swapped and with what elements they can be swapped with. Here are some objects that developers could allow to be swapped using this library:

* Rows in a table
* Information cards
* Shopping items
* Photo Album

With action function, developers can allow more than just swapping. For example, a feature to delete the cards can also be implemented when dragged to a garbage bin. A developer could also make shopping site where product items can be moved to a shopping cart.

## Understanding MoveIt.js
### Items
In order to allow HTML elements to be swapped, the attribute `moveit-item` must be added to it. Once MoveIt is initialized, it will be given a unqiue id as an attribute `moveit-id`. The id is based off the position of occurrence in the HTML, id 0 being the first. Now, the swappable HTML elements are a MoveIt **item**.
```
<div id="content">
    <div moveit-item class="card" moveit-id="0">
        <img src="picture.png">
    </div>
    <div moveit-item class="card">
        <img src="differentPicture.png" moveit-id="1">
    </div>
</div>
```
Once `moveit-item` is added, its children cannot be an item as well. The children will simply be ignored.

### Swapping
To swap two items by dragging, the user must click and hold an item. The item picked up is **held** and its orignal element is known as the **origin**. When dragging over another item, the item underneath is considered to be the **hovered**.

![swap](/pub/image/drag-demo.gif)

## Properties
Items have properties that determine how they behave. These are called **default properties** and all items follow them. Each item also has a set of **item properties** that only apply to that specific item. If an items item property is not set, it will resort to using the default properties.

|  | Item Property | Default Property | Result
|--|---------------|------------------|--------
|holdCursor | "pointer" | "default" | "pointer"
|dragWeight | undefined | 0 | 0
|elementHeldStyle | "color: red;" | undefined | "color: red;"

Link to documentation: https://moveit-js.herokuapp.com/documentation?page=api
