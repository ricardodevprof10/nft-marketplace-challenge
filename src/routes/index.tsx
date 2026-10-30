
import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

import { AppLayout } from '../components/layout/AppLayout'
import { PagePlaceholder } from '../components/layout/PagePlaceholder'
import { NFTMarketplacePage } from '../features/nfts/NFTMarketplacePage'
import { NFTDetailPage } from '../features/nfts/NFTDetailPage'
import { CartPage } from '../features/cart/CartPage'
import { CheckoutPage } from '../features/checkout/CheckoutPage'
import { OrderDetailPage } from '../features/checkout/OrderDetailPage'

import { LoginPage } from '../features/auth/LoginPage'
import { RegisterPage } from '../features/auth/RegisterPage'
import { ProfilePage } from '../features/auth/ProfilePage'
import { ProtectedPage } from '../features/auth/ProtectedPage'
import { WalletsPage } from '../features/wallets/WalletsPage'

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
  validateSearch: (search: Record<string, unknown>) => {
    const validSorts = [
      'newest',
      'price_asc',
      'price_desc',
    ] as const

    const sort =
      typeof search.sort === 'string' &&
      validSorts.some((value) => value === search.sort)
        ? (search.sort as (typeof validSorts)[number])
        : 'newest'

    const rawPage = Number(search.page ?? 1)

    return {
      search:
        typeof search.search === 'string'
          ? search.search
          : '',
      category:
        typeof search.category === 'string'
          ? search.category
          : '',
      sort,
      page:
        Number.isSafeInteger(rawPage) && rawPage > 0
          ? rawPage
          : 1,
    }
  },
  component: NFTMarketplacePage,
})

const nftRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nft/$nftId',
  component: NFTDetailPage,
})

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
})

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <ProtectedPage>
      <ProfilePage />
    </ProtectedPage>
  ),
})

const walletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wallets',
  component: () => (
    <ProtectedPage>
      <WalletsPage />
    </ProtectedPage>
  ),
})

const orderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders/$orderId',
  component: OrderDetailPage,
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
