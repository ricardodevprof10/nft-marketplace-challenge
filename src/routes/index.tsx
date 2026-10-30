
import { NFTCatalog } from '../features/nfts/NFTCatalog'
import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

import { AppLayout } from '../components/layout/AppLayout'
import { PagePlaceholder } from '../components/layout/PagePlaceholder'

const rootRoute = createRootRoute({
  component: AppLayout,
  notFoundComponent: () => (
    <PagePlaceholder
      title="Página não encontrada"
      description="A página solicitada não existe."
    />
  ),
})


const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-12">
      <header className="mb-10">
        <p className="mb-3 text-sm font-semibold text-red-500">
          NFT Marketplace
        </p>

        <h1 className="text-4xl font-bold md:text-5xl">
          Explore NFTs
        </h1>

        <p className="mt-4 text-neutral-400">
          Descubra coleções digitais e novas oportunidades.
        </p>
      </header>

      <NFTCatalog />
    </main>
  ),
})


const nftRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nft/$nftId',
  component: () => (
    <PagePlaceholder
      title="Detalhes do NFT"
      description="Informações, edições e compra do NFT."
    />
  ),
})

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: () => (
    <PagePlaceholder
      title="Carrinho"
      description="Itens e resumo da compra."
    />
  ),
})

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: () => (
    <PagePlaceholder
      title="Pagamento"
      description="Revisão e envio do pedido."
    />
  ),
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => (
    <PagePlaceholder
      title="Login"
      description="Acesso à conta do colecionador."
    />
  ),
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: () => (
    <PagePlaceholder
      title="Cadastro"
      description="Criação de uma nova conta."
    />
  ),
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <PagePlaceholder
      title="Perfil"
      description="Dados e configurações da conta."
    />
  ),
})

const walletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wallets',
  component: () => (
    <PagePlaceholder
      title="Carteiras"
      description="Gerenciamento de carteiras digitais."
    />
  ),
})

const orderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders/$orderId',
  component: () => (
    <PagePlaceholder
      title="Pedido"
      description="Estado e recibo da compra."
    />
  ),
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  nftRoute,
  cartRoute,
  checkoutRoute,
  loginRoute,
  registerRoute,
  profileRoute,
  walletsRoute,
  orderRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
