
import { useRealtime } from './useRealtime'

export function RealtimeIndicator() {
  const status = useRealtime()

  const isConnected = status === 'connected'

  return (
    <div
      role="status"
      className="flex items-center gap-2 text-xs text-neutral-400"
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isConnected
            ? 'bg-green-500'
            : status === 'connecting'
              ? 'bg-yellow-500'
              : 'bg-red-500'
        }`}
      />

      <span>
        {isConnected
          ? 'Tempo real conectado'
          : status === 'connecting'
            ? 'Conectando...'
            : 'Tempo real desconectado'}
      </span>
    </div>
  )
}
