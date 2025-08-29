import fs from 'fs'
import path from 'path'


export const jsonPath = path.join(process.env.APPDATA!, 'user')
const userData =  path.join(jsonPath, 'user.json')

export type userProps = {
    username: string
    image: string
    email: string
    password: string
    status: string
}

const defaultUser = {
    'username': '',
    'email': '',
    'password': '',
    'image': '',
    'status': 'offline'
}
if (!fs.existsSync(jsonPath)) {fs.mkdirSync(jsonPath, { recursive: true })}
if (!fs.existsSync(userData)) {fs.writeFileSync(userData, JSON.stringify(defaultUser, null, 2))}

export const createUser = ({username, image, email, password, status}: userProps) => {
    const user = {username, email, image, password, status}
    fs.writeFileSync(userData, JSON.stringify(user, null, 2)) //-> Remplazo el usuario completo
}

export const getUser = (): userProps => {
    const user = fs.readFileSync(userData, 'utf-8')
    return JSON.parse(user)
}