var net = require('net')
  , BigNumber = require('./bignumber')
  , crypto = require('./crypto')
  , scribe = require("scribe-js")()
  , readline = require('readline')
  , d = require("./diffie")
  , rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
  , m = module.exports = {}
  , methods = {}

m.rl = rl

m.getRandom = function () {
  return crypto.setRandomNumber(6, 5)
}

m.getPublicPair = function () {
  var k = crypto.setRandomNumber(16, 5)
    , p = d.getPrime(k)
    , g = d.getGenerator(k, p)[0]

  return [p, g]
}

messages = [
]

function sendMessage(client) {
  if (messages.length == 1) {
    setTimeout(function () {
      current = messages.splice(0, 1)[0]
      client.write(current, function () {
          sendMessage(client) 
      })
    }, 100)
  }
}

m.writeJson = function (client, data, encrypted) {
  var data = JSON.stringify(data)

  if (encrypted !== false && client.profile.S) {
    console.log("Encrypting message ...")
    data = d.rc4(client.profile.S.toString(16), data)
  }

  messages.push(data)

  //client.write(data)
  sendMessage(client)
}

m.readJson = function (client, data) {
  data = data.toString()

  console.log("\nRaw", "==========================")
  console.log(data)
  console.log("=================================\n")

  if (client.profile.S) {
    console.log("Decrypting message ...")
    data = d.rc4(client.profile.S.toString(16), data)
  }

  try {
    return JSON.parse(data)
  } catch (err) { }
  return null
}

m.handleRequest = function (client, data) {
  console.log(data)
  method = methods[data.method]
  method(client, data)
}

m.registerMethod = function (name, callback) {
  methods[name] = callback
}

m.dh = function (base, random, prime) {
  base = new BigNumber(base)
  random = new BigNumber(random)
  prime = new BigNumber(prime)

  result = base.pow(random)
  shared_key = result.mod(prime)

  console.log("DH: "
    , base.toNumber()
    , random.toNumber()
    , prime.toNumber()
    , result.toNumber()
    , shared_key.toNumber())

  return shared_key
}
