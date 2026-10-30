
export interface NFTUpdatedEvent {
  nftId: string
  version: number
  timestamp: string
}

export interface OrderUpdatedEvent {
  orderId: string
  status: 'pending' | 'confirmed' | 'rejected'
  version: number
  timestamp: string
}

export interface StockChangedEvent {
  nftIds: string[]
  orderId?: string
}

export function isNFTUpdatedEvent(
  value: unknown,
): value is NFTUpdatedEvent {
  if (!value || typeof value !== 'object') {
    return false
  }

  const data = value as Record<string, unknown>

  return (
    typeof data.nftId === 'string' &&
    data.nftId.length > 0 &&
    typeof data.version === 'number' &&
    Number.isSafeInteger(data.version) &&
    data.version >= 1 &&
    typeof data.timestamp === 'string'
  )
}

export function isOrderUpdatedEvent(
  value: unknown,
): value is OrderUpdatedEvent {
  if (!value || typeof value !== 'object') {
    return false
  }

  const data = value as Record<string, unknown>

  return (
    typeof data.orderId === 'string' &&
    data.orderId.length > 0 &&
    (
      data.status === 'pending' ||
      data.status === 'confirmed' ||
      data.status === 'rejected'
    ) &&
    typeof data.version === 'number' &&
    Number.isSafeInteger(data.version) &&
    data.version >= 1 &&
    typeof data.timestamp === 'string'
  )
}
