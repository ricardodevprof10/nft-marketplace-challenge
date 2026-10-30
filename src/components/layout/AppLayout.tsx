
import { Link, Outlet } from '@tanstack/react-router'

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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
          <Link
            to="/"
            search={defaultSearch}
            className="text-xl font-bold tracking-tight"
          >
            NFT<span className="text-red-500">MARKET</span>
          </Link>

          <nav
            aria-label="Navegação principal"
            className="flex items-center gap-6"
          >
            <Link
              to="/"
              search={defaultSearch}
              activeProps={{
                className: 'text-red-400',
              }}
              className="text-sm hover:text-red-400"
            >
              Explorar
            </Link>

            <Link
              to="/cart"
              aria-label="Carrinho"
              className="hover:text-red-400"
            >
              🛒
            </Link>

            <Link
              to="/wallets"
              aria-label="Carteiras"
              className="hover:text-red-400"
            >
              ▣
            </Link>

            <Link
              to="/profile"
              aria-label="Perfil"
              className="hover:text-red-400"
            >
              ♙
            </Link>
          </nav>
        </div>
      </header>

      <Outlet />

      <footer className="mt-12 border-t border-neutral-800 py-8 text-center text-sm text-neutral-400">
        NFT Marketplace — Frontend Challenge
      </footer>
    </div>
  )
}
