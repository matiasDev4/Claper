import { Credenciales } from "@renderer/components/Credenciales"

export const Login = ({ setLoginOpen }: { setLoginOpen: React.Dispatch<React.SetStateAction<boolean>> }) =>  {
    
    return (
        <section className="fixed top-0 bottom-0 left-0 right-0 bg-[#111111]/60 flex justify-center items-center">
            <Credenciales setLoginOpen={setLoginOpen} />
        </section>
    )
}