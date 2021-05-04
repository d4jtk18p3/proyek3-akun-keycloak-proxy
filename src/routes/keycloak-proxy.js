import express from 'express'
import httpProxy from 'http-proxy-middleware'
import https from 'https'
import htmlParser from 'node-html-parser'

const BASE_URL = process.env.KEYCLOAK_CLIENT_BASE_URL
const LOGIN_PAGE_PATH = /auth\/realms\/development\/protocol\/openid-connect\/auth/
const LOGIN_ACTION_PATH = /auth\/realms\/.+\/login-actions\/authenticate/

const { parse } = htmlParser

const router = express.Router()

router.use(httpProxy.createProxyMiddleware({
  selfHandleResponse: true,
  target: BASE_URL,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req) => {
    if (req.path.match(LOGIN_PAGE_PATH)) {
      req.isLoginPage = true
    }
    else if (req.path.match(LOGIN_ACTION_PATH)) {

    }
  },
  onProxyRes: httpProxy.responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    if (req.isLoginPage) {
      const response = responseBuffer.toString('utf8')
      const root = parse(responseBuffer.toString('utf8'))

      const loginForm = root.querySelector('#kc-form-login')

      if (loginForm) {
        const action = loginForm.attributes['action']

        res.location('http://localhost:5002/auth/masuk?action=' + encodeURIComponent(action))
        res.status(302)
      }
    }

    return responseBuffer
  })
}))

export default router
