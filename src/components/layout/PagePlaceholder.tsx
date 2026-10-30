
type PagePlaceholderProps = {
  title: string
  description: string
}

export function PagePlaceholder({
  title,
  description,
}: PagePlaceholderProps) {
  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-16">
      <h1 className="text-3xl font-bold md:text-5xl">
        {title}
      </h1>

      <p className="mt-5 max-w-2xl text-neutral-400">
        {description}
      </p>

      <div className="mt-10 rounded-xl border border-neutral-800 bg-neutral-900 p-8">
        <p className="text-neutral-300">
          Estrutura da página criada. A implementação
          funcional será adicionada nas próximas etapas.
        </p>
      </div>
    </main>
  )
}
