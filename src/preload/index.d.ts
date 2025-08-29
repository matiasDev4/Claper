import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    scraping: {
      scraperInit: (email: string, password: string) => Promise<void>
      start: () => Promise<void>
      sendLogRender: (type: string, message: string) => Promise<void>
      getUser: () => Promise<{}>
      onLogScraper: (callBack: (log) => void) => void
    }
  }
}
