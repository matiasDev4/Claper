import { Route, Routes } from "react-router-dom"
import { App } from "./App"

export const Routers = () => {
    return (
        <Routes>
            <Route index element={<App />}/>
            <Route path='/home' element={<App />} />
        </Routes>
    )
}