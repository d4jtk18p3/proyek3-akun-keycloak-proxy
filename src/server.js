import express from 'express'
import session from 'express-session'
import keycloakProxyRouter from './routes/keycloak-proxy'

const app = express()

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use(keycloakProxyRouter)

export default app
