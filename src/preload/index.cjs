const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("devicehub", {
  getVendors: () => ipcRenderer.invoke("vendors:get"),
  openExternal: (url) => ipcRenderer.invoke("portal:openExternal", url)
});
