import { ipcMain } from "electron"
import { scraper, sendLogg, VerificateData } from "../scraper"
import { createUser, getUser } from "../userData"

export const handlersIPC = () => {
    ipcMain.handle('redeem-rewards', async (_, email: string, password: string) => {
        await VerificateData(email, password)
    })

    ipcMain.handle('start', async (_) => {
        await scraper()
    })

    ipcMain.handle('logs-renderer', async (_, type: string, message: string) => {
        sendLogg(type as 'ERROR' | 'SUCCESS' | 'ALERT' | 'INFO', message)
    })

    ipcMain.handle('create-user', (_, username: string, email: string, password: string, image: string, status: string) => {
        createUser({username, email, image, password, status})
    })

    ipcMain.handle('get-user', async () => {
        return getUser()
    })
}