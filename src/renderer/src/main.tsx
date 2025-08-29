import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { Routers } from './Routers'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routers />
    </HashRouter>
  </StrictMode>

)
