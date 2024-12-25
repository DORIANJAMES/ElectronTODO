const electron = require('electron');
const {ipcRenderer} = electron

CheckToDoCount();
ipcRenderer.on('todo:addItem', (e, todo) => {
// to-do Container
    const todoContainer = document.querySelector(".todo-container")

//row
    const row = document.createElement("div")
    row.className = "row"

//col
    const col = document.createElement("div")
    col.className = "p-2 mb-3 text-light bg-dark col-md-8 offset-2 shadow card d-flex justify-content-center flex-row align-items-center"
    col.setAttribute("style", "background-color: #582E48!important")

// p
    const p = document.createElement("p")
    p.className = "m-0 w-100"
    p.innerHTML = todo.text

// button
    const buttonEdit = document.createElement("button")
    buttonEdit.className = "btn btn-sm btn-outline-warning flex-shrink-1 margin-r-5"
    buttonEdit.addEventListener("click", () => {
        if (confirm("Bu kaydı değiştirmek istediğinizden emin misiniz?")) {
            // TODO: Edit işlemi.
        }
    })

    const iEdit = document.createElement('i')
    iEdit.setAttribute("data-feather", "edit")

    const iDelete = document.createElement('i')
    iDelete.setAttribute("data-feather", "delete")
    iDelete.style.zIndex = "-1"
    iDelete.style.position = "relative"

    const buttonDelete = document.createElement("button")
    buttonDelete.className = "btn btn-sm btn-outline-danger flex-shrink-1"
    buttonDelete.style.zIndex = "0"
    buttonDelete.style.position = "relative"
    buttonDelete.addEventListener("click", (e) => {
        if (confirm("Bu kaydı silmek istediğinizden emin misiniz?")) {
            let deleteParent = e.target.parentNode.parentNode;
            deleteParent.remove();
        }
    })

    buttonEdit.appendChild(iEdit)
    buttonDelete.appendChild(iDelete)

    col.appendChild(p);
    col.appendChild(buttonEdit)
    col.appendChild(buttonDelete)

    row.appendChild(col);

    todoContainer.appendChild(row)
    feather.replace();
    CheckToDoCount();
})

let mainValue = document.querySelector("#main-input-value")
let mainAddButton = document.querySelector("#main-add-button")

mainAddButton.addEventListener("click", (e) => {
    ipcRenderer.send("newTodo:save", mainValue.value);
    mainValue.value = "";
})

function CheckToDoCount() {
    const container = document.querySelector(".todo-container")
    const alert = document.querySelector(".alert-container")
    if (container.children.length !== 0) {
        alert.style.display = "none"
    } else {
        alert.style.display = "block"
    }
}

