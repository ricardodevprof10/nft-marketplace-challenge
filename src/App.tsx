
function App() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-2xl font-bold">
            NFT<span className="text-red-500">MARKET</span>
          </h1>

          <span className="text-sm text-neutral-400">
            Frontend Challenge
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="mb-4 font-semibold text-red-500">
          NFT Marketplace
        </p>

        <h2 className="max-w-3xl text-4xl font-bold md:text-6xl">
          Explore o universo dos NFTs
        </h2>

        <p className="mt-6 max-w-xl text-lg text-neutral-400">
          Descubra coleções digitais e acompanhe
          seus ativos em um marketplace moderno.
        </p>

        <div className="mt-12 rounded-xl border border-neutral-800 bg-neutral-900 p-8">
          <h3 className="text-xl font-semibold">
            Ambiente configurado
          </h3>

          <p className="mt-3 text-neutral-400">
            React, TypeScript, Vite e Tailwind CSS
            estão prontos para o desenvolvimento.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
