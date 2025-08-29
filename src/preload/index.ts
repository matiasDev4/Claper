import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('scraping', {
      scraperInit: (email: string, password: string) => ipcRenderer.invoke('redeem-rewards', email, password),
      start: () => ipcRenderer.invoke('start'),
      sendLogRender: (type: string, message: string) => ipcRenderer.invoke('logs-renderer', type, message),
      getUser: () => ipcRenderer.invoke('get-user'), 
      onLogScraper: (callback: (log: {type: string, message: string}) => void) => {
        ipcRenderer.on('scrap-log',(_, log) => callback(log))
      }
    })

  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
