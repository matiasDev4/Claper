import { useEffect, useState } from "react"

type userProps = {
    username: string,
    email?: string,
    password?: string,
    image: string,
    status: string
}

export const Header = ({ setLoginOpen, login }: {login: boolean, setLoginOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [user, setUser] = useState<userProps>({username:'default', image: '', status: 'offline'})

    const handlerUserData = async () => {
        const getUser = await window.scraping.getUser()
        setUser({username: getUser['username'], image: getUser['image'], status: getUser['status']})
    }

    useEffect(() => {
        handlerUserData()
    }, [login])

    return (
        <header className="w-full h-16 bg-[#000000] flex items-center px-2">
            {user.status === 'offline' 
            ? 
            <button 
            onClick={()=>setLoginOpen(true)}
            className="bg-amber-500 text-white font-semibold py-1 px-4 rounded-md">
                Cuenta SHIFT
            </button> 
            :
            <div className="p-2 flex gap-x-4 items-center">
                <img src={user.image} alt={user.username}
                    className="w-12 h-12 rounded-lg" />
                <div>
                    <h1 className="text-white font-semibold text-lg">{user.username}</h1>
                    <span className="text-[#888888] text-md">{user.status}</span>
                </div>
            </div>}
        </header>
    )
}