import { useEffect, useState, type FormEvent } from 'react'
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
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar do perfil" className="h-16 w-16 rounded-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-900 text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
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
          <div>
            <label htmlFor="profile-avatar">Avatar (URL HTTPS da imagem)</label>
            <input id="profile-avatar" className={fieldClass} type="url" placeholder="https://exemplo.com/avatar.png" value={avatarUrl} onChange={event => setAvatarUrl(event.target.value)} />
            <p className="mt-2 text-sm text-neutral-400">Deixe em branco para usar a inicial do seu nome.</p>
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
