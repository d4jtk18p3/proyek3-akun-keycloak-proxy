import server from './server'

server.listen(process.env.SERVER_PORT, () =>
  console.log(`Server app listening on port ${process.env.SERVER_PORT}!`)
)
