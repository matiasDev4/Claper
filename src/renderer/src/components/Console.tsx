
import { useEffect, useRef } from "react"
import { Logs } from "./Logs"
import { LogsProps, TypeEnum } from "@renderer/App"


export const Console = ({ logs, setLogs }: { logs: LogsProps[], setLogs: React.Dispatch<React.SetStateAction<LogsProps[]>> }) => {
    useEffect(() => {
        window.scraping.onLogScraper((log: LogsProps) => {
            setLogs(prev => [...prev, log])
        })
    }, [])
    const logEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [logs])

    return (
        <section className="w-full h-[500px] border border-[#464646] rounded-lg px-4 py-2
        flex flex-col overflow-auto
        [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-[#999999]
        [&::-webkit-scrollbar-thumb]:bg-[#1b1b1b]
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-thumb]:rounded-full
        ">
            {logs.map(item =>
                <Logs type={item.type as TypeEnum} message={item.message} />
            )}
            <div ref={logEndRef}/>
        </section>
    )
}