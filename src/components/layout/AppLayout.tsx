
import { Link, Outlet } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { RealtimeIndicator } from '../../features/realtime/RealtimeIndicator'

const defaultSearch = {
  search: '',
  category: '',
  sort: 'newest' as const,
  page: 1,
}

export function AppLayout() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-5 py-5">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <Link
              to="/"
              search={defaultSearch}
              className="text-xl font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-red-400"
            >
              NFT
              <span className="text-red-500">
                MARKET
              </span>
            </Link>

            <nav
              aria-label="Navegação principal"
              className="flex flex-wrap items-center gap-5"
            >
              <Link
                to="/"
                search={defaultSearch}
                activeProps={{
                  className: 'text-red-400',
                }}
                className="text-sm hover:text-red-400 focus-visible:outline-2 focus-visible:outline-red-400"
              >
                Explorar
              </Link>

              <Link
                to="/favorites"
                activeProps={{
                  className: 'text-red-400',
                }}
                className="inline-flex items-center gap-2 text-sm hover:text-red-400 focus-visible:outline-2 focus-visible:outline-red-400"
              >
                <Heart
                  size={16}
                  aria-hidden="true"
                />
                Favoritos
              </Link>

              <Link
                to="/cart"
                className="text-sm hover:text-red-400 focus-visible:outline-2 focus-visible:outline-red-400"
              >
                Carrinho
              </Link>

              <Link
                to="/wallets"
                className="text-sm hover:text-red-400 focus-visible:outline-2 focus-visible:outline-red-400"
              >
                Carteiras
              </Link>

              <Link
                to="/profile"
                className="text-sm hover:text-red-400 focus-visible:outline-2 focus-visible:outline-red-400"
              >
                Perfil
              </Link>
            </nav>
          </div>

          <div className="mt-4 flex justify-end">
            <RealtimeIndicator />
          </div>
        </div>
      </header>

      <Outlet />

      <footer className="mt-12 border-t border-neutral-800 py-8 text-center text-sm text-neutral-400">
        NFT Marketplace — Frontend Challenge
      </footer>
    </div>
  )
}
