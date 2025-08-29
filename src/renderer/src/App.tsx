
import { useState } from "react"
import { Console } from "./components/Console"
import { Login } from "./layouts/Login"
import { Header } from "./components/Header"

export type TypeEnum = 'ERROR' | 'SUCCESS' | 'ALERT' | 'INFO'

export type LogsProps = {
    type: TypeEnum
    message: string
}

export const App = () => {
    const [logs, setLogs] = useState<LogsProps[]>([])
    const [loginOpen, setLoginOpen] = useState(false)

    const handlerScript = async () => {
        const user = await window.scraping.getUser()
        if (user['username'] === '') {
            await window.scraping.sendLogRender('ERROR', 'No se encontro una cuenta SHIFT')
        } else {
            await window.scraping.sendLogRender('INFO', 'Iniciando sistema')
            await window.scraping.start()
        }
    }

    return (
        <>
            <section className="w-full h-screen bg-[#111111] flex flex-col justify-between ">
                <Header setLoginOpen={setLoginOpen} login={loginOpen} />
                <div className="w-full px-2">
                    <Console logs={logs} setLogs={setLogs} />
                    <div className="py-4 px-2 flex items-center gap-x-4">
                        <button
                            onClick={handlerScript}
                            className=" bg-green-600 text-red-100 py-0.5 px-4 rounded-md text-lg
                    hover:bg-green-700 hover:cursor-pointer transition-colors duration-300"
                        >Iniciar</button>
                        <button
                            onClick={() => setLogs([])}
                            className="border border-red-600 text-red-100 py-0.5 px-4 rounded-md bg-red-500/10
                    hover:bg-red-700 hover:cursor-pointer transition-colors duration-300 text-md"
                        >Limpiar consola</button>
                    </div>
                </div>
                {loginOpen && <Login setLoginOpen={setLoginOpen} />}
            </section>
        </>
    )
}