
import { test, expect } from '@playwright/test'

const viewports = [
  {
    name: 'Celular compacto',
    width: 375,
    height: 812,
  },
  {
    name: 'Celular grande',
    width: 430,
    height: 932,
  },
  {
    name: 'Tablet',
    width: 768,
    height: 1024,
  },
  {
    name: 'Desktop',
    width: 1440,
    height: 900,
  },
]

test.describe('Responsividade do Marketplace', () => {
  for (const viewport of viewports) {
    test(`catálogo em ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      })

      await page.goto('/')

      await expect(
        page.getByRole('heading', {
          name: /explore nfts/i,
        }),
      ).toBeVisible()

      await expect(
        page.getByPlaceholder(
          /nome, coleção ou criador/i,
        ),
      ).toBeVisible()

      await expect(
        page.locator('img[src*="/nfts/"]').first(),
      ).toBeVisible()

      const dimensions = await page.evaluate(() => ({
        documentWidth:
          document.documentElement.scrollWidth,
        viewportWidth:
          document.documentElement.clientWidth,
      }))

      expect(
        dimensions.documentWidth,
        `Existe rolagem horizontal em ${viewport.name}`,
      ).toBeLessThanOrEqual(
        dimensions.viewportWidth + 1,
      )
    })
  }

  test('menu principal permanece acessível no celular', async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 375,
      height: 812,
    })

    await page.goto('/')

    await expect(
      page.getByRole('link', {
        name: 'Carrinho',
      }),
    ).toBeVisible()

    await expect(
      page.getByRole('link', {
        name: 'Perfil',
      }),
    ).toBeVisible()
  })

  test('página de cadastro funciona no celular', async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 375,
      height: 812,
    })

    await page.goto('/register')

    await expect(
      page.getByRole('heading', {
        name: 'Criar conta',
      }),
    ).toBeVisible()

    await expect(
      page.getByLabel('E-mail'),
    ).toBeVisible()

    await expect(
      page.getByRole('button', {
        name: 'Criar conta',
      }),
    ).toBeVisible()
  })
})
