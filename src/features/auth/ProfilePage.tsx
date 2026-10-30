import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth, useAuthActions } from './useAuth'

function errorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = error.response as { data?: { message?: string } }
    if (response?.data?.message) return response.data.message
  }
  return 'Não foi possível concluir a operação. Tente novamente.'
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { data: user } = useAuth()
  const { logout, updateProfile, changePassword } = useAuthActions()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const avatarInput = useRef<HTMLInputElement>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profileMessage, setProfileMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  useEffect(() => {
    if (!user) return
    setName(user.name)
    setEmail(user.email)
    setAvatarUrl(user.avatarUrl ?? '')
  }, [user])

  async function selectAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5_000_000) {
      setProfileMessage('Escolha uma imagem JPG, PNG ou WebP de até 5 MB.')
      return
    }
    try {
      const url = URL.createObjectURL(file)
      try {
        const image = new Image()
        image.src = url
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = 256
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Canvas indisponível')
        const side = Math.min(image.width, image.height)
        ctx.drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, 256, 256)
        setAvatarUrl(canvas.toDataURL('image/webp', 0.7))
        setProfileMessage('Foto selecionada. Clique em Salvar perfil.')
      } finally { URL.revokeObjectURL(url) }
    } catch { setProfileMessage('Não foi possível ler essa imagem.') }
  }

  async function handleProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setProfileMessage('')
    try {
      await updateProfile.mutateAsync({ name, email, avatarUrl })
      setProfileMessage('Perfil atualizado com sucesso.')
    } catch (error) {
      setProfileMessage(errorMessage(error))
    }
  }

  async function handlePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPasswordMessage('')
    if (newPassword !== confirmPassword) {
      setPasswordMessage('A confirmação da senha não corresponde.')
      return
    }
    try {
      await changePassword.mutateAsync({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordMessage('Senha atualizada com sucesso.')
    } catch (error) {
      setPasswordMessage(errorMessage(error))
    }
  }

  async function handleLogout() {
    try {
      await logout.mutateAsync()
      await navigate({ to: '/login' })
    } catch {
      // A mensagem de erro aparece abaixo.
    }
  }

  if (!user) return null
  const fieldClass = 'mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-red-500'
  const buttonClass = 'rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50'

  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl px-5 py-12 text-white">
      <h1 className="text-4xl font-bold">Meu perfil</h1>
      <p className="mt-3 text-neutral-400">Gerencie sua conta demonstrativa.</p>

      <section className="mt-10 rounded-xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8">
        <div className="flex items-center gap-5">
          <input ref={avatarInput} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label="Selecionar foto" onChange={(event) => void selectAvatar(event)} />
          <button type="button" onClick={() => avatarInput.current?.click()} title="Alterar foto" aria-label="Alterar foto do perfil" className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-red-900 text-2xl font-bold hover:ring-2 hover:ring-red-500 focus-visible:ring-2 focus-visible:ring-red-500">
            {avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : user.name.charAt(0).toUpperCase()}
            <span className="absolute bottom-0 w-full bg-black/70 text-center text-[10px]">Editar</span>
          </button>
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="mt-1 text-neutral-400">{user.email}</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-neutral-400">Identificador: <span className="break-all">{user.id}</span></p>
        <p className="mt-2 text-sm text-neutral-400">Cadastro: {new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
      </section>

      <section className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold">Editar informações</h2>
        <form onSubmit={(event) => void handleProfile(event)} className="mt-6 space-y-5">
          <div>
            <label htmlFor="profile-name">Nome</label>
            <input id="profile-name" className={fieldClass} required maxLength={80} value={name} onChange={event => setName(event.target.value)} />
          </div>
          <div>
            <label htmlFor="profile-email">E-mail</label>
            <input id="profile-email" className={fieldClass} type="email" required value={email} onChange={event => setEmail(event.target.value)} />
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => avatarInput.current?.click()} className="rounded-lg border border-neutral-700 px-5 py-3 hover:border-red-500">Escolher foto do dispositivo</button>
            {avatarUrl && <button type="button" onClick={() => { setAvatarUrl(''); setProfileMessage('Foto removida da prévia. Clique em Salvar perfil.') }} className="rounded-lg border border-neutral-700 px-5 py-3 hover:border-red-500">Remover foto</button>}
            <p className="w-full text-sm text-neutral-400">JPG, PNG ou WebP, até 5 MB.</p>
          </div>
          <button className={buttonClass} type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? 'Salvando...' : 'Salvar perfil'}
          </button>
          {profileMessage && <p role="status" className="text-sm text-neutral-200">{profileMessage}</p>}
        </form>
      </section>

      <section className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold">Alterar senha</h2>
        <form onSubmit={(event) => void handlePassword(event)} className="mt-6 space-y-5">
          <div>
            <label htmlFor="current-password">Senha atual</label>
            <input id="current-password" className={fieldClass} type="password" autoComplete="current-password" required value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} />
          </div>
          <div>
            <label htmlFor="new-password">Nova senha</label>
            <input id="new-password" className={fieldClass} type="password" autoComplete="new-password" minLength={8} required value={newPassword} onChange={event => setNewPassword(event.target.value)} />
          </div>
          <div>
            <label htmlFor="confirm-password">Confirmar nova senha</label>
            <input id="confirm-password" className={fieldClass} type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} />
          </div>
          <button className={buttonClass} type="submit" disabled={changePassword.isPending}>
            {changePassword.isPending ? 'Alterando...' : 'Alterar senha'}
          </button>
          {passwordMessage && <p role="status" className="text-sm text-neutral-200">{passwordMessage}</p>}
        </form>
      </section>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link to="/wallets" className={buttonClass}>Minhas carteiras</Link>
        <button type="button" disabled={logout.isPending} onClick={() => void handleLogout()} className="rounded-lg border border-neutral-700 px-6 py-3 hover:border-red-500 disabled:opacity-50">
          {logout.isPending ? 'Saindo...' : 'Sair da conta'}
        </button>
      </div>
      {logout.isError && <p role="alert" className="mt-5 text-red-400">Não foi possível encerrar a sessão.</p>}
    </main>
  )
}
