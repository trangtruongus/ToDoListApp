var picker = datepicker("#due-date", {
    formatter: function (input, date, _) {
        var value = date.toLocaleDateString();
        input.value = value;
    }
});
picker.setMin(new Date());
var ToDoItem = (function () {
    function ToDoItem() {
    }
    return ToDoItem;
}());
window.onload = function () {
    var addItem = document.getElementById("add");
    addItem.onclick = main;
    loadSavedItems();
};
function getInput(id) {
    return document.getElementById(id);
}
function loadSavedItems() {
    var itemArray = getToDoItems();
    if (itemArray != null) {
        for (var i = 0; i < itemArray.length; i++) {
            var currItem = itemArray[i];
            displayToDoItem(currItem);
        }
    }
}
function main() {
    if (isValid()) {
        var item = getToDoItem();
        if (!doesTodoTitleExist(item.title)) {
            displayToDoItem(item);
            saveToDo(item);
        }
        else {
            alert("That todo already exists");
        }
    }
}
function isValid() {
    var title = getInput("title").value.trim();
    var dueDate = getInput("due-date").value.trim();
    if (title == "") {
        getInput("title-err-msg").innerText = "Title can't be empty!";
        return false;
    }
    if (dueDate == "") {
        getInput("due-date-err-msg").innerText = "Due date can't be empty!";
        return false;
    }
    if (dueDate !== "" && !isValidDate(dueDate)) {
        getInput("due-date-err-msg").innerText = "Due date is not valid!";
        return false;
    }
    getInput("title-err-msg").innerText = "";
    getInput("due-date-err-msg").innerText = "";
    return true;
}
function isValidDate(input) {
    var pattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/g;
    return pattern.test(input);
}
function getToDoItem() {
    var myItem = new ToDoItem();
    var titleInput = getInput("title");
    myItem.title = titleInput.value;
    var dueDateInput = getInput("due-date");
    myItem.dueDate = new Date(dueDateInput.value);
    var isCompleted = getInput("is-complete");
    myItem.isCompleted = isCompleted.checked;
    return myItem;
}
function displayToDoItem(item) {
    var itemText = document.createElement("h3");
    itemText.innerText = item.title;
    var itemDate = document.createElement("p");
    if (item.dueDate) {
        var dueDate = new Date(item.dueDate.toString());
        itemDate.innerText = dueDate.toDateString();
    }
    var itemDiv = document.createElement("div");
    itemDiv.setAttribute("data-task-title", item.title);
    itemDiv.onclick = toggleComplete;
    itemDiv.classList.add("todo");
    if (item.isCompleted) {
        itemDiv.classList.add("completed");
    }
    itemDiv.appendChild(itemText);
    itemDiv.appendChild(itemDate);
    if (item.isCompleted) {
        var completedToDos = document.getElementById("complete-items");
        completedToDos.appendChild(itemDiv);
    }
    else {
        var incompleteToDos = document.getElementById("incomplete-items");
        incompleteToDos.appendChild(itemDiv);
    }
}
function toggleComplete() {
    var itemDiv = this;
    console.log("Item div is:");
    console.log(itemDiv);
    if (itemDiv.classList.contains("completed")) {
        itemDiv.classList.remove("completed");
        var incompleteItems = document.getElementById("incomplete-items");
        incompleteItems.appendChild(itemDiv);
    }
    else {
        itemDiv.classList.add("completed");
        var completedItems = document.getElementById("complete-items");
        completedItems.appendChild(itemDiv);
    }
    var allTodos = getToDoItems();
    var currentTodoTitle = itemDiv.getAttribute("data-task-title");
    for (var index = 0; index < allTodos.length; index++) {
        var nextTodo = allTodos[index];
        if (nextTodo.title == currentTodoTitle) {
            nextTodo.isCompleted = !nextTodo.isCompleted;
        }
    }
    saveAllTodos(allTodos);
}
function saveAllTodos(allTodos) {
    localStorage.setItem(todokey, "");
    var allItemsString = JSON.stringify(allTodos);
    localStorage.setItem(todokey, allItemsString);
}
function doesTodoTitleExist(title) {
    var allTodos = getToDoItems();
    if (allTodos == null) {
        return false;
    }
    for (var index = 0; index < allTodos.length; index++) {
        var currentTodo = allTodos[index];
        if (currentTodo.title == title) {
            return true;
        }
    }
    return false;
}
function saveToDo(item) {
    var currItems = getToDoItems();
    if (currItems == null) {
        currItems = new Array();
    }
    currItems.push(item);
    var currItemsString = JSON.stringify(currItems);
    localStorage.setItem(todokey, currItemsString);
}
var todokey = "todo";
function getToDoItems() {
    var itemString = localStorage.getItem(todokey);
    var item = JSON.parse(itemString);
    return item;
}
