
import type { NFT } from '../../types/nft'

const collections = [
  'Genesis Collection',
  'Digital Worlds',
  'Future Art',
  'Cyber Gallery',
]

const categories = [
  'Arte',
  'Música',
  'Fotografia',
  'Colecionáveis',
]


function ethFromMilli(value: number): string {
  const whole = Math.floor(value / 1000)
  const fraction = String(value % 1000)
    .padStart(3, '0')
    .replace(/0+$/, '')

  return fraction ? `${whole}.${fraction}` : String(whole)
}


export const initialNFTs: NFT[] = Array.from(
  { length: 32 },
  (_, index) => {
    const number = index + 1

    return {
      id: String(number),
      name: `Digital Artifact ${String(number).padStart(3, '0')}`,
      description: `Obra digital exclusiva número ${number}.`,
      imageUrl: '/nft-placeholder.svg',
      collection: collections[index % collections.length],
      creator: `Creator ${index % 6 + 1}`,
      priceEth: ethFromMilli(number * 125),
      available: index % 9 === 0 ? 0 : 2 + index % 8,
      edition: 'Standard',
      category: categories[index % categories.length],
    }
  },
)
