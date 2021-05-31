import connectRedis from 'connect-redis'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import httpProxy from 'http-proxy-middleware'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import htmlParser from 'node-html-parser'
import redis from 'redis'
import { v4 as uuidv4 } from 'uuid'
import qs from 'qs'

const { unset } = _
const { parse: parseHTML } = htmlParser

const KEYCLOAK_BASE_URL = 'http://keycloak.proyek3'
const REDIS_HOSTNAME = 'redis.proyek3'

const app = express()

app.use(cors({
  origin: 'http://localhost:5002',
  credentials: true
}))

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

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.put('/config', (req, res) => {
  req.session.loginUrl = req.body['loginUrl']
  req.session.loginPattern = req.body['loginPattern']

  res.end()
})

app.put('/sessionCredential', (req, res) => {
  req.session.credential = req.body

  res.end()
})

app.use(httpProxy.createProxyMiddleware({
  selfHandleResponse: true,
  target: KEYCLOAK_BASE_URL,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    if (req.session.loginPattern && req.path.match(req.session.loginPattern)) {
      req.isLogin = true
    }

    // Fix body-parser issue by re-streaming the body
    // https://github.com/chimurai/http-proxy-middleware/issues/320
    //
    // qs is used instead of querystring and URLSearchParams because extended
    // option is set to true on express.urlencoded
    if (!req.body || !Object.keys(req.body).length) {
      return
    }

    const contentType = proxyReq.getHeader('Content-Type')

    let body
    if (contentType.startsWith('application/json')) {
      body = JSON.stringify(req.body)
    } else if (contentType.startsWith('application/x-www-form-urlencoded')) {
      body = qs.stringify(req.body)
    }

    if (body) {
      proxyReq.setHeader('Content-Length', Buffer.byteLength(body));
      proxyReq.write(body);
    }
  },
  onProxyRes: httpProxy.responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    if (req.isLogin) {
      return handleLoginRequest(responseBuffer, proxyRes, req, res)
    }

    return responseBuffer
  })
}))

const handleLoginRequest = async (responseBuffer, proxyRes, req, res) => {
  const root = parseHTML(responseBuffer.toString('utf8'))
  const loginForm = root.querySelector('#kc-form-login')

  if (loginForm) {
     const action = loginForm.attributes['action']

    res.location(
      `${req.session.loginUrl}?action=${encodeURIComponent(action)}`
    )
    res.status(302)
  }

  return responseBuffer
}

export default app
