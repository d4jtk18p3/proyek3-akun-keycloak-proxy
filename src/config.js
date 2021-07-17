export const PORT = process.env.PORT || 14416
export const JWT_SECRET = process.env.JWT_SECRET || 'development-secret'
export const KEYCLOAK_BASE_URL = process.env.KEYCLOAK_BASE_URL || 'http://localhost:14417/'
export const KEYCLOAK_LOGIN_PATTERN = process.env.KEYCLOAK_LOGIN_PATTERN || '^/auth/realms/development/.+/auth.*'
export const KEYCLOAK_LOGIN_URL = process.env.KEYCLOAK_LOGIN_URL || 'http://akun.localhost:5000/login'
export const REDIS_HOSTNAME = process.env.REDIS_HOSTNAME || 'redis.proyek3'
export const SESSION_PREFIX = process.env.SESSION_PREFIX || 'akun-keycloak-proxy_session'