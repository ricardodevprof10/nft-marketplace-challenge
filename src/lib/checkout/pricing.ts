
import type { CartItem } from '../../types/cart'
import type { CheckoutQuote } from '../../types/order'

const WEI = 10n ** 18n
const ETH_USD_CENTS = 300000n
const FEE_BASIS_POINTS = 250n
const DISCOUNT_BASIS_POINTS = 1000n
const BASIS_POINTS = 10000n

export const DEMO_COUPON = 'JUNGLE10'

export function ethToWei(value: string): bigint {
  if (!/^\d+(\.\d{1,18})?$/.test(value)) {
    throw new Error('Preço ETH inválido')
  }

  const [whole, fraction = ''] = value.split('.')

  return (
    BigInt(whole) * WEI +
    BigInt(fraction.padEnd(18, '0'))
  )
}

export function weiToEth(value: bigint): string {
  const whole = value / WEI
  const fraction = (value % WEI)
    .toString()
    .padStart(18, '0')
    .replace(/0+$/, '')

  return fraction
    ? `${whole}.${fraction}`
    : whole.toString()
}

export function normalizeCoupon(
  couponCode?: string,
): string | null {
  const value = couponCode?.trim().toUpperCase()

  if (!value) return null

  if (value !== DEMO_COUPON) {
    throw new Error('Cupom inválido')
  }

  return value
}

export function calculateQuote(
  items: CartItem[],
  couponCode?: string,
): CheckoutQuote {
  const coupon = normalizeCoupon(couponCode)

  const subtotal = items.reduce(
    (sum, item) => {
      if (
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1
      ) {
        throw new Error('Quantidade inválida')
      }

      return (
        sum +
        ethToWei(item.priceEth) *
          BigInt(item.quantity)
      )
    },
    0n,
  )

  const discount = coupon
    ? subtotal * DISCOUNT_BASIS_POINTS /
      BASIS_POINTS
    : 0n

  const discounted = subtotal - discount

  const fee =
    discounted * FEE_BASIS_POINTS /
    BASIS_POINTS

  const total = discounted + fee

  const usdCents =
    (total * ETH_USD_CENTS + WEI / 2n) /
    WEI

  const dollars = usdCents / 100n
  const cents = (usdCents % 100n)
    .toString()
    .padStart(2, '0')

  return {
    subtotalEth: weiToEth(subtotal),
    discountEth: weiToEth(discount),
    feeEth: weiToEth(fee),
    totalEth: weiToEth(total),
    totalUsd: `${dollars}.${cents}`,
    ethUsdRate: '3000.00',
    couponCode: coupon,
    feePercent: 2.5,
    isDemoRate: true,
  }
}
