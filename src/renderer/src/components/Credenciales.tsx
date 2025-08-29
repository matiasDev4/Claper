import { validateInput } from "@renderer/utils/validations"
import { useEffect, useRef, useState } from "react"
import { BsFillQuestionCircleFill } from "react-icons/bs";


export const Credenciales = ({ setLoginOpen }: { setLoginOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const ref = useRef<HTMLFormElement>(null)    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (validateInput({ email, password })) {
            await window.scraping.scraperInit(email, password)  
            setLoginOpen(false)
        };
    }

    useEffect(()=> {
        const handlerClose = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setLoginOpen(false)
            }
        }
        document.addEventListener("mousedown", handlerClose);
        return () => {
            document.removeEventListener("mousedown", handlerClose);
        }
    },[])

    return (
        <form ref={ref} action="" className="flex flex-col gap-y-6 px-4 py-4 bg-[#202020] w-[300px] h-auto rounded-lg
        shadow-[0px_0px_10px_black]/20 relative" onSubmit={(e) => handleSubmit(e)}>
            <div className="text-center">
                <h1 className="text-xl text-white font-bold py-1">Hola, esbirro!</h1>
                <span className="text-[#c7c7c7] font-normal text-md">Ingresa tus credenciales shifts</span>
            </div>
            <div className="text-white flex flex-col gap-y-2">
                <label htmlFor="">Correo electronico</label>
                <input type="text"
                    className="border rounded-md border-[#5e5e5e] outline-0 px-2 py-1"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </div>
            <div className="text-white flex flex-col gap-y-2">
                <label htmlFor="">Contraseña</label>
                <input type="password"
                    className="border rounded-md border-[#797979] outline-0 px-2 py-1"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
            </div>
            <div className="flex items-end">
                <button className="bg-green-600 w-full px-6 py-2 rounded-md text-white font-semibold
                hover:cursor-pointer hover:bg-green-700 transition-colors duration-200">
                    Ingresar
                </button>
            </div>
            <div className="absolute top-0 right-0 group">
                <span className="absolute right-2 top-2 text-xl text-white
                hover:cursor-pointer"><BsFillQuestionCircleFill /></span>
                <div className="absolute hidden
                opacity-0 group-hover:block group-hover:opacity-100 transition-opacity duration-300 w-80 left-10 bg-[#5c5c5c] text-[#d8d8d8] p-4 rounded-lg leading-relaxed font-semibold">
                    <p>Tus credenciales no son compartidas con terceros, se almacenan en tu computadora de manera segura para que solo este sistema 
                    tenga acceso a tu cuenta shift y pueda reclamar las recompensas de manera automatizada. Tambien vas a poder ver en todo momento como se comporta el sistema.
                    </p>
                </div>
            </div>
        </form>
    )
}