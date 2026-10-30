
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

  // O checkout exige uma conta e uma carteira de demonstração conectada.
  await page.goto('/register')
  await page.getByLabel('Nome').fill('Cliente Checkout')
  await page.getByLabel('E-mail').fill(`checkout-${crypto.randomUUID()}@example.com`)
  await page.getByLabel('Senha de demonstração').fill('senha-teste-123')
  await page.getByRole('button', { name: 'Criar conta' }).click()
  await expect(page).toHaveURL(/\/profile/)

  await page.goto('/wallets')
  await page.getByLabel('Nome da carteira').fill('Carteira de teste')
  await page.getByLabel('Endereço público Ethereum').fill('0x1111111111111111111111111111111111111111')
  await page.getByRole('button', { name: 'Adicionar carteira' }).click()
  await expect(page.getByText('Carteira cadastrada com sucesso.')).toBeVisible()

  await page.goto('/')
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

  await page.getByLabel('Carteira cadastrada').selectOption({ label: 'Carteira de teste' })
  await page.getByRole('button', { name: 'Conectar carteira simulada' }).click()
  const confirmButton = page.getByRole('button', { name: 'Confirmar pedido simulado' })
  await expect(confirmButton).toBeEnabled()
  await confirmButton.click()

  await expect(page).toHaveURL(/\/orders\//)

  await expect(
    page.getByRole('heading', {
      name: 'Compra simulada concluída',
    }),
  ).toBeVisible()
})
