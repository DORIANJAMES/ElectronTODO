const electron = require("electron");
const path = require("path");
const url = require("url");

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow, yeniToDo;
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

    console.log(process.platform);

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu)

    mainWindow.on("close", () => {
        app.quit();
    })

    ipcMain.on("newTodo:close", () => {
        yeniToDo.close();
        yeniToDo = null;
    })

    ipcMain.on("newTodo:save", (err, data) => {
        if (data) {
            todo={
                id: todoList.length + 1,
                text: data
            }
            todoList.push(
                todo
            );
            mainWindow.webContents.send("todo:addItem", todo);

            yeniToDo.close();
            yeniToDo = null;
        }
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
                    YeniToDoGirisi();
                }
            },
            {
                label: "TODO Ekle"
            },
            {
                label: "Geri Al"
            }
        ]
    }
]

if (process.platform === "darwin") {
    mainMenuTemplate.unshift({
        label: app.name,
        role: "TODO"
    })
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
                {
                    label: "Yenile",
                    role: "reload"
                }
            ]
        }
    )
}

function YeniToDoGirisi() {
    yeniToDo = new BrowserWindow({
        width: 480,
        height: 175,
        title: "Yeni TODO Girişi",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        frame: false,
    })

    yeniToDo.loadURL(url.format(({
        pathname: path.join(__dirname, "pages/yeniToDoWindow.html"),
        protocol: "file:",
        slashes: true,
    })))

    yeniToDo.on("close", () => {
        yeniToDo = null
    })
}

function GetToDoList() {
    console.log(todoList)
}