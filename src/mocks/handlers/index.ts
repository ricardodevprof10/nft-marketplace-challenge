
import { nftHandlers } from './nftHandlers'
import { cartHandlers } from './cartHandlers'
import { orderHandlers } from './orderHandlers'
import { authHandlers } from './authHandlers'
import { walletHandlers } from './walletHandlers'

export const handlers = [
  ...nftHandlers,
  ...cartHandlers,
  ...orderHandlers,
  ...authHandlers,
  ...walletHandlers,
]
