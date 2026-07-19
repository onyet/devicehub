const { app, BrowserWindow, ipcMain, nativeImage, shell } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("node:path");
const { getVendors } = require("./vendors.cjs");

const isDev = !app.isPackaged;
const appIconPath = path.join(__dirname, "../../icons/android/res/mipmap-xxhdpi/ic_launcher.png");
let updaterState = {
  state: isDev ? "disabled" : "idle",
  message: isDev ? "Auto update is only available in packaged builds." : "Ready to check for updates.",
  version: app.getVersion(),
  progress: 0,
  availableVersion: null
};

function publishUpdaterState(nextState) {
  updaterState = { ...updaterState, ...nextState };

  for (const currentWindow of BrowserWindow.getAllWindows()) {
    currentWindow.webContents.send("updater:status", updaterState);
  }

  return updaterState;
}

function checkForUpdates() {
  if (isDev) {
    return publishUpdaterState({
      state: "disabled",
      message: "Auto update is only available in packaged builds.",
      progress: 0
    });
  }

  return autoUpdater.checkForUpdates();
}

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

autoUpdater.on("checking-for-update", () => {
  publishUpdaterState({
    state: "checking",
    message: "Checking for updates.",
    progress: 0
  });
});

autoUpdater.on("update-available", (info) => {
  publishUpdaterState({
    state: "available",
    message: "Update available. Downloading now.",
    availableVersion: info.version,
    progress: 0
  });
});

autoUpdater.on("update-not-available", () => {
  publishUpdaterState({
    state: "idle",
    message: "DeviceHub is up to date.",
    availableVersion: null,
    progress: 0
  });
});

autoUpdater.on("download-progress", (progress) => {
  publishUpdaterState({
    state: "downloading",
    message: "Downloading update.",
    progress: Math.round(progress.percent ?? 0)
  });
});

autoUpdater.on("update-downloaded", (info) => {
  publishUpdaterState({
    state: "downloaded",
    message: "Update downloaded. Restart to install.",
    availableVersion: info.version,
    progress: 100
  });
});

autoUpdater.on("error", (error) => {
  publishUpdaterState({
    state: "error",
    message: error.message,
    progress: 0
  });
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1080,
    minHeight: 720,
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
    mainWindow.loadFile(path.join(__dirname, "../../dist/renderer/index.html"));
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

  ipcMain.handle("updater:getStatus", () => updaterState);

  ipcMain.handle("updater:check", async () => {
    await checkForUpdates();
    return updaterState;
  });

  ipcMain.handle("updater:install", () => {
    if (updaterState.state !== "downloaded") {
      return false;
    }

    autoUpdater.quitAndInstall(false, true);
    return true;
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

  if (!isDev) {
    setTimeout(() => {
      checkForUpdates().catch((error) => {
        publishUpdaterState({
          state: "error",
          message: error.message,
          progress: 0
        });
      });
    }, 3000);
  }

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
