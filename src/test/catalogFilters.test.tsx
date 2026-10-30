
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

function TestFilters() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('newest')

  return (
    <section>
      <label htmlFor="search">
        Buscar NFTs
      </label>

      <input
        id="search"
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
      />

      <label htmlFor="category">
        Categoria
      </label>

      <select
        id="category"
        value={category}
        onChange={(event) =>
          setCategory(event.target.value)
        }
      >
        <option value="">Todas as categorias</option>
        <option value="Arte">Arte</option>
        <option value="Música">Música</option>
      </select>

      <label htmlFor="sort">
        Ordenar por
      </label>

      <select
        id="sort"
        value={sort}
        onChange={(event) =>
          setSort(event.target.value)
        }
      >
        <option value="newest">Mais recentes</option>
        <option value="price_asc">Menor preço</option>
        <option value="price_desc">Maior preço</option>
      </select>
    </section>
  )
}

describe('Filtros do catálogo', () => {
  it('permite pesquisar NFTs', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <div onChange={onChange}>
        <TestFilters />
      </div>,
    )

    const input = screen.getByRole('textbox', {
      name: /buscar nfts/i,
    })

    await user.type(input, 'Digital Artifact')

    expect(input).toHaveValue('Digital Artifact')
    expect(onChange).toHaveBeenCalled()
  })

  it('permite selecionar uma categoria', async () => {
    const user = userEvent.setup()

    render(<TestFilters />)

    const select = screen.getByRole('combobox', {
      name: /categoria/i,
    })

    await user.selectOptions(select, 'Arte')

    expect(select).toHaveValue('Arte')
  })

  it('permite ordenar por menor preço', async () => {
    const user = userEvent.setup()

    render(<TestFilters />)

    const select = screen.getByRole('combobox', {
      name: /ordenar por/i,
    })

    await user.selectOptions(select, 'price_asc')

    expect(select).toHaveValue('price_asc')
  })
})
