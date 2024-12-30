require("dotenv").config();
const electron = require("electron");
const path = require("path");
const url = require("url");
const feather = require("feather-icons");
const db = require("./lib/connection").db;

const {app, BrowserWindow, Menu, ipcMain, dialog} = electron;

let mainWindow, newToDo, editToDoWindow, initialWidth, initialHeight;
let todoList = []

app.on("ready", () => {

    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        frame: false,
    })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "pages/mainWindow.html"),
        protocol: "file:",
        slashes: true,
    }))

    initialWidth = mainWindow.getBounds().width;
    initialHeight = mainWindow.getBounds().height;

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu)

    mainWindow.on("close", () => {
        app.quit();
    })

    ipcMain.on("todo:removeFromDb", (err, data) => {

        db.query("DELETE FROM todos where id = ?", data, (err, result, fields) => {
            if (result.affectedRows > 0) {
                console.log("Bir adet kayıt silinmiştir. ");
            }
        })
    })

    ipcMain.on("showMessage", (err, data) => {
        dialog.showMessageBox(mainWindow, {
            type: "question",
            title: "Onayınız Gereklidir!",
            message: "Bu kaydı silmek istediğinizden emin misiniz?",
            icon: path.join(__dirname, "assets/img/100x100-icon.png"),
            buttons: ['Hayır', 'Evet'],
            defaultId: 1,
            cancelId: 0
        }).then(result => {
            if (result.response === 1) {
                mainWindow.webContents.send("deleteMessageOK", data)
            }
        }).catch(err => console.log(err));

    })

    ipcMain.on("newTodo:close", () => {
        newToDo.close();
        newToDo = null;
    })

    ipcMain.on("editTodo:editWindow", (err, data) => {
        if (data) {
            editTodo = {
                id: data.id,
                text: data.text,
            }
            //editToDoWindow.webContents.send("editTodo:editItemOnModal", editTodo)
            EditToDo(editTodo)
        }
    })

    ipcMain.on("editTodo:close", () => {
        editToDoWindow.close()
        editToDoWindow = null
    })

    ipcMain.on("editTodo:save", (err, data) => {
        UpdateDODOListOnDb(data);
        FetchDODOListFromDb("initApp")
        mainWindow.reload()
    })

    ipcMain.on("quitApp", () => {
        app.quit();
    })

    ipcMain.on("minimizeApp", () => {
        mainWindow.minimize();
    })

    ipcMain.on("maximizeApp", () => {
        console.log(mainWindow.isMaximized())
        if (mainWindow.isMaximized() === false) {
            mainWindow.maximize();
        } else {
            mainWindow.setSize(initialWidth, initialHeight, true);
        }
    })

    ipcMain.on("newTodo:save", (err, data) => {
        if (data) {
            db.query("INSERT INTO todos SET text = ?", data, (err, result, fields) => {
                if (result.affectedRows > 0) {
                    mainWindow.webContents.send("todo:addItem", {
                        id: result.insertId,
                        text: data,
                    });
                }
            })


            if (newToDo != null) {
                newToDo.close();
                newToDo = null;
            }

        }
    })

    mainWindow.webContents.on("dom-ready", () => {
        FetchDODOListFromDb("initApp")
    })

})

const mainMenuTemplate = [
    {
        label: app.name,
        submenu: [
            {
                label: "Yenile",
                role: "reload"
            },
            {
                label: "Çıkış",
                role: "quit"
            }
        ]
    },
    {
        label: "Dosya",
        submenu: [
            {
                label: "Aksiyonlar",
                submenu: [
                    {
                        label: "Hepsini Seç",
                        role: "selectAll"
                    },
                    {
                        label: "Undo",
                        role: "undo"
                    },
                    {
                        label: "Kes",
                        role: "cut"
                    },
                    {
                        label: "Kopyala",
                        role: "copy"
                    },
                    {
                        label: "Yapıştır",
                        role: "paste"
                    },
                    {
                        label: "Sil",
                        role: "delete"
                    }
                ]
            },
            {type: "separator"},
            {
                label: "Yeni TODO Penceresi",
                click(item, focusedWindow) {
                    NewTODOEnterance(1)
                }
            },
            {
                label: "TODO Ekle"
            },
            {
                label: "Geri Al"
            },
        ]
    }
]

if (process.platform === "darwin") {
    mainMenuTemplate.unshift(
        {
            label: app.name,
            role: "quit"
        }
    )
}

if (process.env.NODE_ENV !== "production") {
    mainMenuTemplate.push(
        {
            label: "Geliştirici Araçları",
            submenu: [
                {
                    label: "Geliştirici Ayarları",
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                },
            ]
        }
    )
}

const UpdateDODOListOnDb = (data) => {
    let id=data.id
    let text = data.text
    db.query("UPDATE todos SET text = ? WHERE id = ?", [text, id], (error, results, fields) => {
        console.log(results)
    })
}

const FetchDODOListFromDb = (channel) => {
    db.query("SELECT * from todos", (err, results, fields) => {
        mainWindow.webContents.send(channel, results)
    })
}
const NewTODOEnterance = () => {
    newToDo = new BrowserWindow({
        width: 480,
        height: 175,
        title: "New TODO",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        frame: false,
    })

    newToDo.loadURL(url.format(({
        pathname: path.join(__dirname, "pages/newToDoWindow.html"),
        protocol: "file:",
        slashes: true,
    })))

    newToDo.on("close", () => {
        newToDo = null
    })
}

function EditToDo(data) {
    editToDoWindow = new BrowserWindow({
        width: 481,
        height: 178,
        title: "Edit TODO",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        frame: false,
    })

    if (data !== null && data !== undefined) {
        console.log(data)
        editToDoWindow.webContents.once("dom-ready", () => {
            editToDoWindow.webContents.send('editTodo:editItemOnModal', data)
        })

    }

    editToDoWindow.loadURL(url.format(({
        pathname: path.join(__dirname, "pages/editToDoWindow.html"),
        protocol: "file:",
        slashes: true,
    })))

    editToDoWindow.on("close", () => {
        editToDoWindow = null
    })

    editToDoWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === "Escape" && editToDoWindow !== null) {
            editToDoWindow.close();
            editToDoWindow = null
        }
    })

}