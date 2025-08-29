import { LogsProps } from "@renderer/App"



export const Logs = ({type, message}: LogsProps) => {
    return (
        <div className="flex gap-x-2">
            <span className={`inline-block w-auto text-left font-mono 
            ${type === 'ERROR' ? 'text-red-500' : 
                type === 'SUCCESS' ? 'text-green-500' :
                type === 'ALERT' ? 'text-amber-500' : 'text-white'
            }
            `}
            >{`[${type}]: `}</span><span className="text-[#c4c4c4]">{message}</span>
        </div>
    )
}