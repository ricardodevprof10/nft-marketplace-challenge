
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Acessibilidade do NFT Marketplace', () => {
  const pages = [
    { path: '/', name: 'Catálogo' },
    { path: '/cart', name: 'Carrinho' },
    { path: '/login', name: 'Login' },
    { path: '/register', name: 'Cadastro' },
  ]

  for (const item of pages) {
    test(`${item.name} não possui violações críticas ou graves`, async ({
      page,
    }) => {
      await page.goto(item.path)

      await expect(page.locator('body')).toBeVisible()

      const results = await new AxeBuilder({ page })
        .withTags([
          'wcag2a',
          'wcag2aa',
          'wcag21a',
          'wcag21aa',
        ])
        .analyze()

      const seriousViolations = results.violations.filter(
        (violation) =>
          violation.impact === 'critical' ||
          violation.impact === 'serious',
      )

      for (const violation of seriousViolations) {
        console.log(
          `\nPágina: ${item.name}`,
          `\nRegra: ${violation.id}`,
          `\nImpacto: ${violation.impact}`,
          `\nDescrição: ${violation.description}`,
        )

        for (const node of violation.nodes) {
          console.log(
            `Elemento: ${node.target.join(', ')}`,
            `Correção: ${node.failureSummary}`,
          )
        }
      }

      expect(seriousViolations).toEqual([])
    })
  }

  test('a página inicial possui título principal', async ({
    page,
  }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /explore nfts/i,
      }),
    ).toBeVisible()
  })

  test('a navegação principal é acessível', async ({
    page,
  }) => {
    await page.goto('/')

    const navigation = page.getByRole('navigation', {
      name: 'Navegação principal',
    })

    await expect(navigation).toBeVisible()

    await expect(
      navigation.getByRole('link', {
        name: 'Explorar',
      }),
    ).toBeVisible()
  })
})
