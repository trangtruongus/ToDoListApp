// @ts-ignore: Ignoring issue with js-datepicker lack of intellisense
const picker = datepicker("#due-date",{
    formatter: (input, date, _) => {
        const value = date.toLocaleDateString()
        input.value = value // => '1/1/2099'
    }
});
picker.setMin(new Date()); // Set to today's date

class ToDoItem{
    title:string;
    dueDate:Date;
    isCompleted:boolean;
}

window.onload = function(){
    let addItem = document.getElementById("add");
    addItem.onclick = main;
    let clearItem = document.getElementById("clear");
    clearItem.onclick = clearSavedItems;
    loadSavedItems();
}

function getInput(id):HTMLInputElement{
    return <HTMLInputElement>document.getElementById(id);
}

function loadSavedItems(){
    let itemArray = getToDoItems(); // read from storage

    if(itemArray != null){
        for(let i = 0; i < itemArray.length; i++){
            let currItem = itemArray[i];
            displayToDoItem(currItem);
        }
    }
    
}

function main(){
    if(isValid()){
        let item = getToDoItem();
        if(!doesTodoTitleExist(item.title)){
            displayToDoItem(item);
            saveToDo(item);
        }
        else{
            alert("That todo already exists");
        }
    }
}

/**
 * Check form data is valid
 */
function isValid():boolean{
    let title = getInput("title").value.trim();
    let dueDate = getInput("due-date").value.trim();
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

function isValidDate(input: string): boolean {
    // Validating mm/dd/yyyy or m/d/yyyy
    // \d{1,2}\/d{1,2}\/d{4}
    let pattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/g;

    return pattern.test(input);
}

/**
 * Get all input off form and wrap in
 * a ToDoItem object
 */
function getToDoItem():ToDoItem{
    let myItem = new ToDoItem();
    // get title
    let titleInput = getInput("title");
    myItem.title = titleInput.value;

    // get due date
    let dueDateInput = getInput("due-date");
    myItem.dueDate = new Date(dueDateInput.value);

    // get isCompleted
    let isCompleted = getInput("is-complete");
    myItem.isCompleted = isCompleted.checked;

    return myItem;
}



/**
 * Display given ToDoItem on the web page
 */
function displayToDoItem(item:ToDoItem):void{
    // ex. <h3>Record JS Lecture</h3>
    let itemText = document.createElement("h3");
    itemText.innerText = item.title;

    // ex. <p>June 1st 2020</p>
    let itemDate = document.createElement("p");
    // itemDate.innerText = item.dueDate.toDateString();
    if (item.dueDate) { // Check if item.dueDate is not null or undefined
        let dueDate = new Date(item.dueDate.toString());
        itemDate.innerText = dueDate.toDateString();
    }

    // ex. <div class="todo completed"></div> or <div class="todo"></div>
    let itemDiv = document.createElement("div");
    itemDiv.setAttribute("data-task-title", item.title);
    itemDiv.onclick = toggleComplete;

    itemDiv.classList.add("todo");
    if(item.isCompleted){
        itemDiv.classList.add("completed");
    }
    
    itemDiv.appendChild(itemText);
    itemDiv.appendChild(itemDate);

    if(item.isCompleted){
        let completedToDos = document.getElementById("complete-items");
        completedToDos.appendChild(itemDiv);
    }
    else{
        let incompleteToDos = document.getElementById("incomplete-items");
        incompleteToDos.appendChild(itemDiv);
    }
}

/**
 * If the clicked item was incomplete, it will be marked as completed.
 * Otherwise it will be marked incomplete
 */
function toggleComplete(){
    let itemDiv = <HTMLElement>this;
    console.log("Item div is:");
    console.log(itemDiv);

    if(itemDiv.classList.contains("completed")){
        // Remove complete class if previously marked as completed
        itemDiv.classList.remove("completed");
        let incompleteItems = document.getElementById("incomplete-items");
        incompleteItems.appendChild(itemDiv);
    }
    else{
        // Add completed item to complete-items div
        itemDiv.classList.add("completed");
        let completedItems = document.getElementById("complete-items");
        completedItems.appendChild(itemDiv);
    }

    let allTodos = getToDoItems();
    let currentTodoTitle = itemDiv.getAttribute("data-task-title");
    for(let index = 0; index < allTodos.length; index++){
        let nextTodo = allTodos[index]; // Get ToDo out of array
        if(nextTodo.title == currentTodoTitle){
            nextTodo.isCompleted = !nextTodo.isCompleted; // Flip complete/incomplete
        }
    }

    saveAllTodos(allTodos);  // Re-save into storage
}

/**
 * Clear all current todos from storage
 * and save a new list
 * @param allTodos The list to save
 */
function saveAllTodos(allTodos: ToDoItem[]) {
    localStorage.setItem(todokey, ""); // Clear current items
    let allItemsString = JSON.stringify(allTodos); // Get new storage string with all Todos
    localStorage.setItem(todokey, allItemsString);
}

function doesTodoTitleExist(title:string){
    let allTodos = getToDoItems();

    if(allTodos == null){
        return false;
    }
    
    for(let index = 0; index < allTodos.length; index++){
        
        let currentTodo = allTodos[index];
        if(currentTodo.title == title){
            return true;
        }
    }

    return false;
}

/**
 * Save a new item in storage
 * @param item The item to save
 */
function saveToDo(item:ToDoItem):void{
    let currItems = getToDoItems();
    if(currItems == null){ // No items found
        currItems = new Array();
    }
    currItems.push(item); // Add the new item to the curr item list

    let currItemsString = JSON.stringify(currItems);
    localStorage.setItem(todokey, currItemsString);
}

const todokey = "todo";

/**
 * Get stored ToDo items or return null if
 * none are found
 */
function getToDoItems():ToDoItem[]{
    let itemString = localStorage.getItem(todokey);
    let item:ToDoItem[] = JSON.parse(itemString);
    return item;
}

function clearSavedItems() {
    localStorage.clear();
    document.getElementById("incomplete-items").innerHTML = "";
    document.getElementById("complete-items").innerHTML = "";
}