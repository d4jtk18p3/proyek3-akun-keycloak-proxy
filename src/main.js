import server from './server'

server.listen(process.env.PORT, () =>
  console.log(`Server app listening on port ${process.env.PORT}!`)
)
