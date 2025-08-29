type inputsLogs = {
    email?: string,
    password?: string
}

export const validateInput = ({email, password}: inputsLogs): boolean => {
    if (email?.trim() !== '' && password?.trim() !== '') {
        return true
    }
    window.scraping.sendLogRender('ERROR', 'Los campos no deben estar vacios')
    return false
} 