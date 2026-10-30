
import { Link, Outlet } from '@tanstack/react-router'
import { ShoppingCart, UserRound, Wallet } from 'lucide-react'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800">
        <nav
          aria-label="Navegação principal"
          className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5"
        >
          <Link
            to="/"
            className="text-xl font-bold focus-visible:outline-2 focus-visible:outline-red-500"
          >
            NFT<span className="text-red-500">MARKET</span>
          </Link>

          <div className="flex flex-wrap items-center gap-5 text-sm">
            <Link to="/" activeProps={{ className: 'text-red-400' }}>
              Explorar
            </Link>

            <Link to="/cart" aria-label="Carrinho">
              <ShoppingCart size={21} />
            </Link>

            <Link to="/wallets" aria-label="Carteiras">
              <Wallet size={21} />
            </Link>

            <Link to="/profile" aria-label="Perfil">
              <UserRound size={21} />
            </Link>
          </div>
        </nav>
      </header>

      <Outlet />

      <footer className="border-t border-neutral-800 px-5 py-8 text-center text-sm text-neutral-400">
        NFT Marketplace — Frontend Challenge
      </footer>
    </div>
  )
}
