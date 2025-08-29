import { Browser, chromium, ChromiumBrowser, Page } from "playwright-core";
import { config, BROWSER } from "./config/config";
import { BrowserWindow } from "electron";
import { createUser, getUser, jsonPath } from "./userData";
import fs from 'fs'

let mainWindow: BrowserWindow

export const setMainWindow = (win: BrowserWindow) => {
    mainWindow = win
}

export const sendLogg = (type: 'ERROR' | 'SUCCESS' | 'ALERT' | 'INFO', message: string) => {
    if (mainWindow) {
        mainWindow.webContents.send('scrap-log', { type, message })
    }
}

let emailData = ''
let passwordData = ''

export const VerificateData = async (email: string, password: string) => {
    let redex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (redex.test(email)) {
        emailData = email
        passwordData = password
        await scraper()
    } else {
        sendLogg('ERROR', 'El email es invalido')
    }

}

const codes: string[] = []

const browserPath = BROWSER.find(item => fs.existsSync(item))

if (!browserPath) sendLogg('ALERT', 'No se encontro un navegador disponible')

export const scraper = async () => {
    const user = getUser()
    const browser = await chromium.launch({ 
        headless: true, 
        args: ["--disable-gpu-shader-disk-cache",'--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage', "--disable-setuid-sandbox", "--disable-software-rasterizer"], 
        executablePath: browserPath,
    })
    
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto(config['HOME_URL'])
    sendLogg('INFO', 'Ingresando a /HOME')
    await handleLogin(page, browser, user.email === '' ? emailData : user.email, user.password === '' ? passwordData : user.password)
    sendLogg('INFO', 'Ingresando a /ACCOUNT')
    await page.goto(config['ACCOUNT_URL'])
    sendLogg('INFO', 'Obteniendo usuario')
    const username = await page.locator('#current_display_name').textContent()
    sendLogg('INFO', `Usuario: ${username}`)

    if (user.email === '' && user.username === '') {
        sendLogg('INFO', `Guardando credenciales en: ${jsonPath}`)
        createUser({ username: username as string, password: passwordData, email: emailData, status: 'Online', image: 'https://res.cloudinary.com/drsnoi6gn/image/upload/v1756216007/7307964_0_n10xnb.webp' })
        await browser.close()
        sendLogg('SUCCESS', 'Login exitoso')
        return
    }

    await searchCodes(browser)
    sendLogg('INFO', 'Ingresando /REWARDS')
    for (const i of codes) {
        await reedemCodes(page, i)
        
    }
    sendLogg('SUCCESS', 'Todos los codigos fueron canjeados')
    await browser.close()

}

const handleLogin = async (page: Page, browser: ChromiumBrowser, email: string, password: string) => {
    sendLogg('INFO', 'Verificando credenciales')
    try {
        await page.locator('#user_email').fill(email)
        await page.locator('#user_password').fill(password)
        await page.click('input[type="submit"]')

        const errorLogin = await page.$('div.alert.error')
        const isVisible = await errorLogin?.isVisible()
        if (isVisible) {
            sendLogg('ERROR', 'Credenciales invalidas, intente nuevamente')
            sendLogg('ALERT', 'Cerrando navegador...')
            await browser.close()
            sendLogg('ALERT', 'Navegador cerrado')
        } else {
            sendLogg('SUCCESS', 'Sesion iniciada')
        }
    } catch (err) {
        sendLogg('ERROR', err as string)
        return
    }
}

const searchCodes = async (browser: Browser) => {
    sendLogg('INFO', 'Buscando codigos SHIFT')
    try {
        const context = await browser.newContext()
        const page = await context.newPage()
        await page.goto('https://mentalmars.com/game-news/borderlands-3-golden-keys/', { waitUntil: 'load', timeout: 30000 })
        const content = await page.locator('code.copy-the-code-target')
        const text = await content.allTextContents()
        for (const i of text) {
            codes.push(i)
        }

    } catch (err) {
        sendLogg('ERROR', err as string)
        await browser.close()
    }

}

const reedemCodes = async (page: Page, code: string) => {
    await page.goto(config['REWARDS_URL'])
    sendLogg('INFO', `Canjeando codigo: ${code}`)
    let processed = new Set<string>() 

    while (true) {

        await page.locator('#shift_code_input').fill(code)
        await page.click('button[id="shift_code_check"]')
        await page.waitForTimeout(1500)

        const hasResults = await page.locator('#code_results').isVisible()
        if (!hasResults) {
            sendLogg('ALERT', 'codigo expirado o invalido')
            break
        }

        const titles = await page.locator('#code_results h2').allTextContents()
        const buttons = page.locator('input[name="commit"]')
        const total = await buttons.count()

        if (total === 0) {
            sendLogg('ERROR', "No se encontraron recompensas")
            break
        }


        let claimed = false

        for (let i = 0; i < total; i++) {
            
            const rewardName = titles[i] ?? `Juego #${i+1}`
            if (processed.has(rewardName)) continue

            await buttons.nth(i).click()
            await page.waitForTimeout(1000)

            const notice = await page.$('div.alert.notice')
            if (await notice?.isVisible()) {
                sendLogg('ALERT', `Ya fue canjeado: ${rewardName}`)
                processed.add(rewardName)
            } else {
                sendLogg('SUCCESS', `Canjeando: ${rewardName}`)
                processed.add(rewardName)
                claimed = true
            }
            break
        }

        if (!claimed && processed.size >= total) {
            sendLogg('INFO', `Todas las recompensas de ${code} ya estaban canjeadas`)
            break
        }
    }
    sendLogg('SUCCESS', 'Procesado con exito')
}


        
        
    
    


