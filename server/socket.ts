
import { createServer } from 'node:http'
import { Server } from 'socket.io'

const PORT = Number(
  process.env.PORT || process.env.SOCKET_PORT || 3001,
)

const configuredOrigins = (
  process.env.FRONTEND_URLS || ''
)
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean)

const allowedOrigins = new Set(configuredOrigins)

function isAllowedOrigin(
  origin: string | undefined,
): boolean {
  if (!origin) return true

  if (allowedOrigins.has(origin)) return true

  if (process.env.NODE_ENV !== 'production') {
    try {
      const url = new URL(origin)

      return (
        url.hostname === 'localhost' ||
        url.hostname === '127.0.0.1' ||
        url.hostname.endsWith('.app.github.dev')
      )
    } catch {
      return false
    }
  }

  return false
}

const httpServer = createServer((request, response) => {
  if (
    request.url === '/' ||
    request.url === '/health'
  ) {
    response.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    })

    response.end(
      JSON.stringify({
        service: 'NFT Marketplace Realtime',
        status: 'running',
        timestamp: new Date().toISOString(),
      }),
    )

    return
  }

  response.writeHead(404, {
    'Content-Type': 'application/json; charset=utf-8',
  })

  response.end(
    JSON.stringify({
      message: 'Endpoint não encontrado',
    }),
  )
})

const io = new Server(httpServer, {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Origem não autorizada'))
      }
    },
    methods: ['GET', 'POST'],
  },
  allowRequest: (request, callback) => {
    callback(
      null,
      isAllowedOrigin(request.headers.origin),
    )
  },
})

io.on('connection', (socket) => {
  console.log(
    `[Socket.IO] Cliente conectado: ${socket.id}`,
  )

  socket.emit('server:welcome', {
    message: 'Conexão em tempo real estabelecida',
    timestamp: new Date().toISOString(),
  })

  socket.on(
    'nft:stock-changed',
    (payload: unknown) => {
      if (
        !payload ||
        typeof payload !== 'object'
      ) {
        return
      }

      const data = payload as Record<string, unknown>

      if (
        !Array.isArray(data.nftIds) ||
        data.nftIds.length === 0 ||
        data.nftIds.length > 100 ||
        !data.nftIds.every(
          (id) =>
            typeof id === 'string' &&
            id.length > 0 &&
            id.length <= 100,
        )
      ) {
        return
      }

      const event = {
        nftIds: data.nftIds as string[],
        orderId:
          typeof data.orderId === 'string' &&
          data.orderId.length <= 100
            ? data.orderId
            : undefined,
        timestamp: new Date().toISOString(),
      }

      socket.broadcast.emit(
        'nft:stock-updated',
        event,
      )

      socket.emit('nft:stock-ack', event)

      console.log(
        '[Socket.IO] Notificação de estoque:',
        event,
      )
    },
  )

  socket.on('disconnect', (reason) => {
    console.log(
      `[Socket.IO] Cliente desconectado: ${socket.id}`,
      reason,
    )
  })
})

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(
    `[Socket.IO] Servidor iniciado na porta ${PORT}`,
  )

  console.log(
    '[Socket.IO] Origens permitidas:',
    configuredOrigins,
  )
})

function shutdown() {
  io.close(() => {
    httpServer.close()
  })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
