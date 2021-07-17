import { PORT } from './config.js'
import server from './server.js'

server.listen(PORT, () =>
  console.log(`Server app listening on port ${PORT}!`)
)