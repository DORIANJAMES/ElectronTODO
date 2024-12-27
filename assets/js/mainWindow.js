const electron = require('electron');
const path = require("path");
const {ipcRenderer, dialog} = electron

let closeAppButton = document.querySelector('#close-app-button');
let minimizeAppButton = document.querySelector('#minimize-app-button');
let maximizeAppButton = document.querySelector('#maximize-app-button');

CheckToDoCount();
ipcRenderer.on('todo:addItem', (e, todo) => {
// to-do Container
    const todoContainer = document.querySelector(".todo-container")

//row
    const row = document.createElement("div")
    row.className = "row"
    row.setAttribute("id", "itemID:" + todo.id)

//col
    const col = document.createElement("div")
    col.className = "p-2 mb-3 text-light bg-dark col-md-12 shadow card d-flex justify-content-center flex-row align-items-center"
    col.setAttribute("style", "background-color: #582E48!important")

// p
    const p = document.createElement("p")
    p.className = "m-0 w-100"
    p.innerHTML = todo.text

// iEdit
    const iEdit = document.createElement('i')
    iEdit.setAttribute("data-feather", "edit")
    iEdit.style.zIndex = "-1"
    iEdit.style.position = "relative"

// button
    const buttonEdit = document.createElement("button")
    buttonEdit.className = "btn btn-sm btn-outline-warning flex-shrink-1 margin-r-5"
    buttonEdit.style.zIndex = "0"
    buttonEdit.style.position = "relative"
    buttonEdit.addEventListener("click", (e) => {
        if (confirm("Bu kaydı değiştirmek istediğinizden emin misiniz?")) {
            let editTodoRow = e.target.parentNode.parentNode
            let editTodoID = editTodoRow.getAttribute("id")
            let editTodo = e.target.parentNode
            let value = editTodo.querySelector("p").innerText
            let editValues = {
                id: editTodoID,
                text: value
            }
            ipcRenderer.send("editTodo:editWindow", editValues)
        }
    });

// iDelete
    const iDelete = document.createElement('i')
    iDelete.setAttribute("data-feather", "delete")
    iDelete.style.zIndex = "-1"
    iDelete.style.position = "relative"

    const buttonDelete = document.createElement("button")
    buttonDelete.className = "btn btn-sm btn-outline-danger flex-shrink-1"
    buttonDelete.style.zIndex = "0"
    buttonDelete.style.position = "relative"
    buttonDelete.addEventListener("click", (e) => {
        let deleteParent = e.target.parentNode.parentNode;
        let deleteParentID = deleteParent.getAttribute("id")

        ipcRenderer.send("showMessage", deleteParentID)


        /*if (confirm("Bu kaydı silmek istediğinizden emin misiniz?")) {
            let deleteParent = e.target.parentNode.parentNode;
            deleteParent.remove();
            CheckToDoCount()
        }*/
    })

    buttonEdit.appendChild(iEdit);
    buttonDelete.appendChild(iDelete);

    col.appendChild(p);
    col.appendChild(buttonEdit);
    col.appendChild(buttonDelete);

    row.appendChild(col);

    todoContainer.appendChild(row);
    feather.replace();
    CheckToDoCount();
})

ipcRenderer.on("editTodo:save", (err, data) => {
    if (data) {
        console.log(data)
        if (document.getAttribute("id") === data.id) {
            let editRow = document.querySelectorAll('p');
            editRow.innerText = data.text;
            feather.replace()
            CheckToDoCount()
        }
    }
})

ipcRenderer.on("deleteMessageOK", (err, data) => {
    console.log(data)
    let deleteParent = document.getElementById(data);
    console.log(deleteParent);
    deleteParent.remove();
    CheckToDoCount()
})

let mainValue = document.querySelector("#main-input-value")
let mainAddButton = document.querySelector("#main-add-button")

mainAddButton.addEventListener("click", (e) => {
    ipcRenderer.send("newTodo:save", mainValue.value);
    mainValue.value = "";
    CheckToDoCount()
})

closeAppButton.addEventListener("click", () => {
    ipcRenderer.send("quitApp")
})

minimizeAppButton.addEventListener("click", () => {
    ipcRenderer.send("minimizeApp")
})

maximizeAppButton.addEventListener("click", () => {
    ipcRenderer.send("maximizeApp")
})

mainValue.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && mainValue.value !== "") {
        ipcRenderer.send("newTodo:save", mainValue.value);
        mainValue.value = "";
        CheckToDoCount()
    }
})

function CheckToDoCount() {
    const container = document.querySelector(".todo-container")
    const alert = document.querySelector(".alert-container")
    document.querySelector('#totalCountContainer').innerText = container.children.length
    if (container.children.length !== 0) {
        alert.style.display = "none"
    } else {
        alert.style.display = "block"
    }
}

