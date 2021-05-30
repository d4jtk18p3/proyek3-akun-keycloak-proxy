import connectRedis from 'connect-redis'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import htmlParser from 'node-html-parser'
import httpProxy from 'http-proxy-middleware'
import redis from 'redis'
import { v4 as uuidv4 } from 'uuid'

const KEYCLOAK_BASE_URL = 'http://keycloak.proyek3'
const REDIS_HOSTNAME = 'redis.proyek3'

const { parse: parseHTML } = htmlParser

const app = express()

app.use(cors({
  origin: 'http://localhost:5002',
  credentials: true
}))
app.use(express.json())

const redisClient = redis.createClient({
  host: REDIS_HOSTNAME
})
const RedisStore = connectRedis(session)

app.use(session({
  store: new RedisStore({
    client: redisClient,
    prefix: 'akun-keycloak-proxy_session:'
  }),
  name: 'akun-keycloak-proxy_session',
  saveUninitialized: false,
  secret: uuidv4(),
  resave: false
}))

app.post('/configure', (req, res) => {
  if (req.session.views) {
    req.session.views++
  } else {
    req.session.views = 1
  }
  req.session.loginUrl = req.body['loginUrl']
  req.session.loginPattern = req.body['loginPattern']

  res.end()
})

app.use(httpProxy.createProxyMiddleware({
  selfHandleResponse: true,
  target: KEYCLOAK_BASE_URL,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    if (req.path.match(req.session.loginPattern)) {
      req.isLoginUrl = true
    }
  },
  onProxyRes: httpProxy.responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    if (req.isLoginUrl) {
      const response = responseBuffer.toString('utf8')
      const root = parseHTML(responseBuffer.toString('utf8'))
      const loginForm = root.querySelector('#kc-form-login')

      if (loginForm) {
        const action = loginForm.attributes['action']

        res.location(
          `${req.session.loginUrl}?action=${encodeURIComponent(action)}`
        )
        res.status(302)
      }
    }

    return responseBuffer
  })
}))

export default app
