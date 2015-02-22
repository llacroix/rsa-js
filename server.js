var net = require('net')
var d = require('./diffie')
var api = require("./api")

var config = {
      id: 0
    }
  , clients = {}
  , clients_by_name = {}


api.registerMethod("exchange_key", function (client, data) {
  B = d.hexToBig(data.params.B)
  //S = Math.pow(B, private_random) % prime
  S = api.dh(B, client.profile.private_random, client.profile.prime)
  console.log("Shared key is :", S)
  client.profile.S = S
})

api.registerMethod("message", function (client, data) {
  console.log("Relaying message from ", data.params.from, " to ", data.params.to)
  
  peer = clients_by_name[data.params.to]

  if (peer) {
    api.writeJson(peer, data)
  }

})

api.registerMethod("setName", function (client, data) {
  console.log("Setting client name to ", data.params.name)
  client.profile.name = data.params.name
  clients_by_name[client.profile.name] = client
})

var server = net.createServer(function (c) {
  c.profile = {}

  pair = api.getPublicPair()

  c.profile.prime = prime = pair[0]
  c.profile.base = base = pair[1]
  c.profile.private_random = private_random = api.getRandom()

  A = api.dh(base, private_random, prime)

  console.log('\n\n', 'Client connected')
  console.log("Generating:", base, private_random, prime, A)

  config.id += 1
  c.profile.id = client_id = config.id

  clients[config.id] = {
    client: c
  }

  c.on('end', function () {
    console.log('Client disconnected')
    delete clients[client_id]
    delete clients_by_name[c.profile.name]
  })

  c.on('data', function (data) {
    console.log("id", client_id, "=>", c.profile.S)

    value = api.readJson(c, data)

    if (value) {
      api.handleRequest(c, value)
    }
  })

  api.writeJson(c, {
    "method": "authenticate"
  , "params": {
      "prime": prime.toString(16),
      "base": base.toString(16),
      "A": A.toString(16),
    }
  })

})

server.listen(4321, function () {
  console.log('Server started')
})
