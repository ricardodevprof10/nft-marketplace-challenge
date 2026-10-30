
import { nftHandlers } from './nftHandlers'
import { cartHandlers } from './cartHandlers'
import { orderHandlers } from './orderHandlers'

export const handlers = [
  ...nftHandlers,
  ...cartHandlers,
  ...orderHandlers,
]
