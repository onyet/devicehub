const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("devicehub", {
  getVendors: () => ipcRenderer.invoke("vendors:get"),
  openExternal: (url) => ipcRenderer.invoke("portal:openExternal", url),
  updater: {
    getStatus: () => ipcRenderer.invoke("updater:getStatus"),
    check: () => ipcRenderer.invoke("updater:check"),
    install: () => ipcRenderer.invoke("updater:install"),
    onStatus: (callback) => {
      const listener = (_event, status) => callback(status);
      ipcRenderer.on("updater:status", listener);
      return () => ipcRenderer.removeListener("updater:status", listener);
    }
  },
  window: {
    minimize: () => ipcRenderer.invoke("window:minimize"),
    toggleMaximize: () => ipcRenderer.invoke("window:toggleMaximize"),
    close: () => ipcRenderer.invoke("window:close")
  }
});
