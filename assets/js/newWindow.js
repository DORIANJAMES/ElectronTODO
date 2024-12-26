const electron = require('electron');
const {ipcRenderer} = electron;
let closeButton = document.querySelector('#close-button');
let saveButton = document.querySelector('#save-button');
let todoValue = document.querySelector("#todoValue")

closeButton.addEventListener('click', () => {
    ipcRenderer.send('newTodo:close');
})
saveButton.addEventListener('click', () => {
    ipcRenderer.send("newTodo:save", todoValue.value)
    todoValue.value = "";
})
