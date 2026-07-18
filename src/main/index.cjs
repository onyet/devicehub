const { app, BrowserWindow, ipcMain, nativeImage, shell } = require("electron");
const path = require("node:path");
const { getVendors } = require("./vendors.cjs");

const isDev = !app.isPackaged;
const appIconPath = path.join(__dirname, "../../icons/android/res/mipmap-hdpi/ic_launcher.png");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1180,
    height: 780,
    minWidth: 920,
    minHeight: 640,
    title: "DeviceHub",
    backgroundColor: "#f8fafc",
    frame: false,
    icon: appIconPath,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../dist/index.html"));
  }
}

app.whenReady().then(() => {
  app.setName("DeviceHub");

  if (process.platform === "darwin" && app.dock) {
    app.dock.setIcon(nativeImage.createFromPath(appIconPath));
  }

  ipcMain.handle("vendors:get", getVendors);

  ipcMain.handle("window:minimize", (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize();
  });

  ipcMain.handle("window:toggleMaximize", (event) => {
    const currentWindow = BrowserWindow.fromWebContents(event.sender);
    if (!currentWindow) return false;

    if (currentWindow.isMaximized()) {
      currentWindow.unmaximize();
      return false;
    }

    currentWindow.maximize();
    return true;
  });

  ipcMain.handle("window:close", () => {
    app.quit();
  });

  ipcMain.handle("portal:openExternal", async (_event, url) => {
    const parsed = new URL(url);

    if (parsed.protocol !== "https:") {
      throw new Error("Only HTTPS vendor portals can be opened.");
    }

    await shell.openExternal(parsed.toString());
    return true;
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
