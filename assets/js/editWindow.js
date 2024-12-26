const electron = require('electron');
const {ipcRenderer} = electron;

let closeButton = document.querySelector('#edit-close-button');
let saveButton = document.querySelector('#edit-save-button');
let editValue = document.querySelector('#editTodoValue');
let editSpan = document.querySelector('#editSpan');

ipcRenderer.on("editTodo:editItemOnModal",(err, data)=>{
    editValue.innerText = data.text
    editSpan.innerText = data.text
    console.log(data)
})

closeButton.addEventListener('click', () => {
    ipcRenderer.send('editTodo:close');
})

saveButton.addEventListener('click', () => {
    ipcRenderer.send('editTodo:save', editValue.value)
    editValue.value = "";
})
