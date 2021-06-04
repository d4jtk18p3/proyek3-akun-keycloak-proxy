import server from './server.js'

const PORT = process.env.PORT || 14416

server.listen(PORT, () =>
  console.log(`Server app listening on port ${PORT}!`)
)
