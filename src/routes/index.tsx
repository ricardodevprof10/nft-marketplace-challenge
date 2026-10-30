
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
    <PagePlaceholder
      title="Explorar NFTs"
      description="Catálogo, busca, filtros e coleções."
    />
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

const pages = [
  { path: '/cart', title: 'Carrinho', description: 'Itens e resumo da compra.' },
  { path: '/checkout', title: 'Pagamento', description: 'Revisão e envio do pedido.' },
  { path: '/login', title: 'Login', description: 'Acesso à conta do colecionador.' },
  { path: '/register', title: 'Cadastro', description: 'Criação de uma nova conta.' },
  { path: '/profile', title: 'Perfil', description: 'Dados e configurações da conta.' },
  { path: '/wallets', title: 'Carteiras', description: 'Gerenciamento de carteiras digitais.' },
  { path: '/orders/$orderId', title: 'Pedido', description: 'Estado e recibo da compra.' },
] as const

const additionalRoutes = pages.map((page) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path: page.path,
    component: () => (
      <PagePlaceholder
        title={page.title}
        description={page.description}
      />
    ),
  }),
)

const routeTree = rootRoute.addChildren([
  homeRoute,
  nftRoute,
  ...additionalRoutes,
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
