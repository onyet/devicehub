const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("devicehub", {
  getVendors: () => ipcRenderer.invoke("vendors:get"),
  openExternal: (url) => ipcRenderer.invoke("portal:openExternal", url),
  window: {
    minimize: () => ipcRenderer.invoke("window:minimize"),
    toggleMaximize: () => ipcRenderer.invoke("window:toggleMaximize"),
    close: () => ipcRenderer.invoke("window:close")
  }
});
