// global variables for DOM manipulation

let expandBox = document.querySelectorAll('.content');
let todo = document.querySelector('.todo-hide');
let deleteBtn = document.querySelectorAll('.delete');
let masterList = document.querySelector('.fullList');
let completeBtn = document.querySelectorAll('.complete');
let completeTodoBtn = document.querySelectorAll('.todo-complete');
let deleteTodoBtn = document.querySelectorAll('.todo-delete');
let searchBtn = document.querySelector('#submitBtn');
let searchText = document.querySelector('#searchText');
let listItem = document.querySelectorAll('.listItem');
let text = document.querySelectorAll('.text');
let createBtn = document.querySelector('#createBtn');
let fade = document.querySelector('.black-hide');
let createForm = document.querySelector('.taskForm-hide');
let addForm = document.querySelector('#formAdd');
let removeForm = document.querySelector('#formRemove');
let submitForm = document.querySelector('#formSubmit');

let dataArray = [];

if(localStorage.todoCompleteArray == null) {
    localStorage.setItem('todoCompleteArray', JSON.stringify(dataArray));
}

// these if statements maintain localStorage keys as arrays to push and pull things from

if(localStorage.names == null) {
    localStorage.setItem('names', JSON.stringify(dataArray));
    localStorage.setItem('todos', JSON.stringify(dataArray));
}

if(localStorage.completeNames == null) {
    localStorage.setItem('completeNames', JSON.stringify(dataArray));
    localStorage.setItem('completeTodos', JSON.stringify(dataArray));
}

// pulls todos, names, completeNames and completeTodos from localStorage

const itemData = JSON.parse(localStorage.getItem('names'));
const todoData = JSON.parse(localStorage.getItem('todos'));
const completeItemData = JSON.parse(localStorage.getItem('completeNames'));
const completeTodoData = JSON.parse(localStorage.getItem('completeTodos'));
const todoCompleteArray = JSON.parse(localStorage.getItem('todoCompleteArray'));

// adds event listeners to one off elements

createBtn.addEventListener('click',unhideForm);
fade.addEventListener('click', hideForm);
addForm.addEventListener('click', formAdd);
removeForm.addEventListener('click', formRemove);
submitForm.addEventListener('click', formSubmit);

// nested for loops create dom objects from data pulled from localStorage and inserts them into the dom
// NOTE we have to add the event listeners to these items individually because the cloneNode method doesn't copy event listeners

for (let i = 0; i < itemData.length; i++) {
    let li = document.querySelector('#template-Li').cloneNode(true);
    li.firstElementChild.firstElementChild.textContent = itemData[i];
    li.removeAttribute('id');
    li.classList = 'listItem';
    li.firstElementChild.addEventListener('click', collapsable);
    li.firstElementChild.lastElementChild.firstElementChild.addEventListener('click', completeTask)
    li.firstElementChild.lastElementChild.lastElementChild.addEventListener('click', delbtnFunc)
    let ul = document.querySelector('#template-Ul').cloneNode();
    ul.removeAttribute('id');

    for(let j = 0; j < todoData[i].length; j++) {
        let liTodo = document.querySelector('#template-Li-todo').cloneNode(true);
        liTodo.removeAttribute('id');
        liTodo.removeAttribute('class');
        liTodo.firstElementChild.firstElementChild.firstElementChild.textContent = todoData[i][j];
        liTodo.firstElementChild.lastElementChild.firstElementChild.addEventListener('click', completeTodoTask);
        liTodo.firstElementChild.lastElementChild.lastElementChild.classList = 'todo-delete';
        liTodo.firstElementChild.lastElementChild.lastElementChild.addEventListener('click', deleteTodoTask);
        // console.log(liTodo.firstElementChild.firstElementChild.firstElementChild.textContent);
        for (item of todoCompleteArray) {
            console.log(item);
            if (liTodo.firstElementChild.firstElementChild.firstElementChild.textContent == item) {
                liTodo.firstElementChild.firstElementChild.classList = 'p-content-complete';
                let delBtn = liTodo.firstElementChild.lastElementChild.firstElementChild;
                liTodo.firstElementChild.lastElementChild.removeChild(delBtn);
            }
        }
        
        ul.appendChild(liTodo);
    }


    let div = document.createElement('div');
    div.classList = 'divider experiment';

    li.appendChild(ul);
    masterList.appendChild(li);
    masterList.appendChild(div);
}


// changes classes to ul on div click to hide or unhide ul

function collapsable(e) {

    if(e.target.classList.contains('content')) {
        if(e.target.nextElementSibling.classList.contains('todo-hide')) {
            e.target.nextElementSibling.classList = 'todo';
        } else {e.target.nextElementSibling.classList = 'todo-hide';}

}   if(e.target.parentNode.classList.contains('content')) {
        if(e.target.parentNode.nextElementSibling.classList.contains('todo-hide')) {
            e.target.parentNode.nextElementSibling.classList ='todo';
        } else {e.target.parentNode.nextElementSibling.classList ='todo-hide';}
}
};

// removes list item from master list.  removes the values of list items from storage arrays

function delbtnFunc(e) {
    if(confirm('Confirm deletion')) {
        var li = e.target.parentNode.parentNode.parentNode;
        for(let i = 0; i < itemData.length; i++) {
            if(e.target.parentNode.previousElementSibling.textContent == itemData[i]) {
                itemData.splice(i,1);
                todoData.splice(i,1);
                localStorage.setItem('names', JSON.stringify(itemData));
                localStorage.setItem('todos', JSON.stringify(todoData));

            }
        }
        masterList.lastElementChild.remove
        masterList.removeChild(li.nextElementSibling);
        masterList.removeChild(li);
    };  
};

// removes list item and stores values in completed keys in local storage

function completeTask(e) {
    // console.log(e.target);
    if(confirm('Confirm task completed?')) {
        var li = e.target.parentNode.parentNode.parentNode;
        li.classList = 'list-item-complete';
        masterList.removeChild(li.nextElementSibling);
        let textVal = e.target.parentNode.previousElementSibling.textContent;
        completeItemData.push(textVal);
        let list = Array.from(e.target.parentNode.parentNode.nextElementSibling.children);
        let completeList = [];
        for(let i = 0; i < list.length; i++) {
            let compVal = list[i].firstElementChild.firstElementChild.firstElementChild.textContent;
            completeList.push(compVal);
        }
        completeTodoData.push(completeList);

        localStorage.setItem('completeNames', JSON.stringify(completeItemData));
        localStorage.setItem('completeTodos', JSON.stringify(completeTodoData));

        for(let i = 0; i < itemData.length; i++) {
            if(e.target.parentNode.previousElementSibling.textContent == itemData[i]) {
                itemData.splice(i,1);
                todoData.splice(i,1);
                localStorage.setItem('names', JSON.stringify(itemData));
                localStorage.setItem('todos', JSON.stringify(todoData));
            }
        }
    };
};

// changes styling of task items p element to denote task completion

function completeTodoTask(e) {

    if(confirm('confirm step completed?')) {
        todoCompleteArray.push(e.target.parentNode.parentNode.firstElementChild.firstElementChild.textContent);
        e.target.parentNode.previousElementSibling.classList = 'p-content-complete';
        let button = e.target.parentNode;
        button.removeChild(e.target);
        localStorage.setItem('todoCompleteArray', JSON.stringify(todoCompleteArray));
    };
};

// removes task from dom and local storage

function deleteTodoTask(e) {
    if(confirm('confirm step deletion?')) {

        let li = e.target.parentNode.parentNode.parentNode;
        // console.log(li);
        e.target.parentNode.parentNode.parentNode.parentNode.removeChild(li);

        for (let i = 0; i < todoData.length; i++) {
            for (let j = 0; j < todoData[i].length; j++) {
                if(todoData[i][j] == e.target.parentNode.previousElementSibling.firstElementChild.textContent) {
                    todoData[i].splice(j,1);
                    localStorage.setItem('todos', JSON.stringify(todoData));
                }
            }
        }
        
    };
};

// brings the task creation from into view and overlays it on the z axis while dimming the rest of the screen

function unhideForm (e) {

    e.preventDefault();
    fade.classList = 'black';
    createForm.classList = 'taskForm';

};

// re-hides the task creation form and un-dims rest of screen

function hideForm (e) {

    e.preventDefault();
    fade.classList = 'black-hide';
    createForm.classList = 'taskForm-hide';

};

// adds extra steps to tasks in account creation and inserts them in the DOM

function formAdd (e) {

    e.preventDefault();
    const labelList = document.querySelectorAll('.formLabel');
    const label = document.createElement('label');
    label.classList = 'formLabel';
    label.setAttribute('name', 'label')
    label.textContent = 'Step ' + labelList.length;
    document.querySelector('#actualForm').insertBefore(label, addForm);

    const input = document.createElement('input');
    input.classList = 'formInput';
    input.setAttribute('name', 'task')
    document.querySelector('#actualForm').insertBefore(input, addForm);

    const br = document.createElement('br');
    document.querySelector('#actualForm').insertBefore(br, addForm);
}

// removes steps from task in creation

function formRemove (e) {

    e.preventDefault();
    let list = document.getElementsByName('label');
    if(list.length > 2) {    
        addForm.previousElementSibling.remove();
        addForm.previousElementSibling.remove();
        addForm.previousElementSibling.remove();
    }
}

// submits and creates new tasks from form data and inserts them into the dom and local storage

function formSubmit(e) {

    e.preventDefault();
    
    let fullList = document.querySelector('.fullList');
    let li = document.querySelector('#template-Li').cloneNode(true);
    let div = document.createElement('div');
    div.classList = 'divider experiment';

    li.firstElementChild.firstElementChild.textContent = document.querySelector('#title').value.toUpperCase();
    itemData.push(document.querySelector('#title').value.toUpperCase());

    li.firstElementChild.addEventListener('click', collapsable);
    li.firstElementChild.lastElementChild.firstElementChild.addEventListener('click', completeTask)
    li.firstElementChild.lastElementChild.lastElementChild.addEventListener('click', delbtnFunc)
    li.removeAttribute('id');
    li.classList = 'listItem';
    document.querySelector('#title').value = '';

    let ul = document.querySelector('#template-Ul').cloneNode();
    let taskItems = document.getElementsByName('task');
    let listArr = Array.from(document.getElementsByName('task'));
    let todoList = [];



    for (let i = 0; i < listArr.length; i++) {
        let liTodo = document.querySelector('#template-Li-todo').cloneNode(true);

        liTodo.firstElementChild.firstElementChild.firstElementChild.textContent = taskItems[i].value;
        todoList.push(taskItems[i].value);

        liTodo.firstElementChild.lastElementChild.firstElementChild.addEventListener('click', completeTodoTask);
        liTodo.firstElementChild.lastElementChild.lastElementChild.classList = 'todo-delete';
        liTodo.firstElementChild.lastElementChild.lastElementChild.addEventListener('click', deleteTodoTask);

        liTodo.removeAttribute('id');
        liTodo.removeAttribute('class');
        ul.appendChild(liTodo);
        taskItems[i].value = '';

    }

    todoData.push(todoList);
    li.appendChild(ul);
    fullList.appendChild(li);
    fullList.appendChild(div);
    ul = document.querySelector('#template-Ul');
    
    for (let i = listArr.length; i > 3; i--) {
        addForm.previousElementSibling.remove();
        addForm.previousElementSibling.remove();
        addForm.previousElementSibling.remove();
    };

    // console.log(ul);
    localStorage.setItem('todos', JSON.stringify(todoData));
    localStorage.setItem('names', JSON.stringify(itemData));

}