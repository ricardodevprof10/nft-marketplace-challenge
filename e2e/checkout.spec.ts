
import { test, expect } from '@playwright/test'

test('adiciona um NFT e conclui o checkout simulado', async ({
  page,
}) => {
  await page.goto('/')

  await page.evaluate(() => {
    localStorage.removeItem('nft-marketplace-cart-v1')
    localStorage.removeItem('nft-marketplace-orders-v1')
    localStorage.removeItem(
      'nft-marketplace-checkout-requests-v1',
    )
  })

  await page.reload()

  await page
    .locator('a[href^="/nft/"]')
    .first()
    .click()

  const addButton = page.getByRole('button', {
    name: 'Adicionar ao carrinho',
  })

  await expect(addButton).toBeVisible()
  await addButton.click()

  await expect(page).toHaveURL(/\/cart/)

  await expect(
    page.getByRole('heading', {
      name: 'Meu carrinho',
    }),
  ).toBeVisible()

  await page.getByRole('link', {
    name: 'Continuar para checkout',
  }).click()

  await expect(page).toHaveURL(/\/checkout/)

  await page.getByRole('button', {
    name: 'Confirmar pedido simulado',
  }).click()

  await expect(page).toHaveURL(/\/orders\//)

  await expect(
    page.getByRole('heading', {
      name: 'Compra simulada concluída',
    }),
  ).toBeVisible()
})
