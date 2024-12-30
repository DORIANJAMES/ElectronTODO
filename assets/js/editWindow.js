const electron = require('electron');
const {ipcRenderer} = electron;

let closeButton = document.querySelector('#edit-close-button');
let saveButton = document.querySelector('#edit-save-button');
let editValue = document.querySelector('#editTodoValue');
let editSpan = document.querySelector('#editSpan');
let editObject = {}

editValue.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
        editObject.text = editValue.value;
        ipcRenderer.send('editTodo:save', editObject)
        editValue.value = "";
    }
})

ipcRenderer.on("editTodo:editItemOnModal", (err, data) => {
    editObject = data
    editValue.value = data.text
    editSpan.innerText = data.text
})

closeButton.addEventListener('click', () => {
    ipcRenderer.send('editTodo:close');
})

saveButton.addEventListener('click', () => {
    editObject.text = editValue.value;
    ipcRenderer.send('editTodo:save', editObject)
    editValue.value = "";
})
