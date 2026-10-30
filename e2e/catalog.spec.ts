
import { test, expect } from '@playwright/test'

test.describe('Catálogo NFT', () => {
  test('abre a página inicial', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', {
        name: /explore nfts/i,
      }),
    ).toBeVisible()
  })

  test('exibe NFTs no catálogo', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByText('NFTs encontrados'),
    ).toBeVisible()

    await expect(
      page.locator('img[src*="/nfts/"]').first(),
    ).toBeVisible()
  })

  test('possui campo de pesquisa', async ({ page }) => {
    await page.goto('/')

    const search = page.getByPlaceholder(
      /nome, coleção ou criador/i,
    )

    await expect(search).toBeVisible()

    await search.fill('Digital Artifact')

    await expect(search).toHaveValue('Digital Artifact')
  })

  test('permite abrir os detalhes de um NFT', async ({
    page,
  }) => {
    await page.goto('/')

    const nftLink = page
      .locator('a[href^="/nft/"]')
      .first()

    await expect(nftLink).toBeVisible()

    await nftLink.click()

    await expect(page).toHaveURL(/\/nft\//)

    await expect(
      page.getByRole('button', {
        name: /adicionar ao carrinho|nft esgotado/i,
      }),
    ).toBeVisible()
  })
})
