
import { test, expect } from '@playwright/test'

test('cadastra uma conta demonstrativa e abre o perfil', async ({
  page,
}) => {
  await page.goto('/register')

  const email = `tester-${Date.now()}@example.com`

  await page.getByLabel('Nome').fill('Usuário Teste')
  await page.getByLabel('E-mail').fill(email)

  await page
    .getByLabel('Senha de demonstração')
    .fill('senha-teste-123')

  await page.getByRole('button', {
    name: 'Criar conta',
  }).click()

  await expect(page).toHaveURL(/\/profile/)

  await expect(
    page.getByRole('heading', {
      name: 'Meu perfil',
    }),
  ).toBeVisible()

  await expect(
    page.getByText(email),
  ).toBeVisible()
})
