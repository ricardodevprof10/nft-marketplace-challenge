
import React from 'react'
import ReactDOM from 'react-dom/client'

import { Providers } from './app/Providers'
import './index.css'

async function bootstrap() {
  if (import.meta.env.VITE_ENABLE_MOCKS === 'true') {
    const { worker } = await import('./mocks/browser')

    await worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    })

    console.log('[NFT Marketplace] MSW iniciado')
  }

  const root = document.getElementById('root')

  if (!root) {
    throw new Error('Elemento root não encontrado.')
  }

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Providers />
    </React.StrictMode>,
  )
}

bootstrap().catch((error: unknown) => {
  console.error(
    '[NFT Marketplace] Erro na inicialização:',
    error,
  )
})
