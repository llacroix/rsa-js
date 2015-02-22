var net = require('net')
var readline = require('readline')
var d = require("./diffie")
var api = require("./api")

var client = net.connect({port: 4321}, function() { 
    console.log('connected to server!')
})

client.profile = profile = {}

api.registerMethod("message", function (client, data) {
  console.log('-------------------')
  console.log(data.params.from, ":")
  console.log(data.params.message)
  console.log('-------------------')
})

api.registerMethod("authenticate", function (client, data) {
  profile.prime = d.hexToBig(data.params.prime)
  profile.base = d.hexToBig(data.params.base)
  //profile.private_random = parseInt(Math.random() * profile.prime)
  profile.private_random = api.getRandom()

  profile.A = d.hexToBig(data.params.A)
  profile.B = api.dh(profile.base, profile.private_random, profile.prime)

  console.log("Generating key: ", profile.base, profile.private_random, profile.prime, profile.B)

  api.writeJson(client, {
    "method": "exchange_key",
    "params": {
      "B": profile.B.toString(16)
    }
  }, false)

  client.profile.S = api.dh(profile.A, profile.private_random, profile.prime)

  console.log("Shared key is ", profile.S)

  api.rl.question("Your name?", function (cmd) {
    client.profile.name = cmd
    api.writeJson(client, {
      "method": "setName",
      "params": {
        "name": cmd
      }
    })

    startChat(client)
  })
})

function startChat(client) {

  function chatSession() {

    api.rl.question("To:>\n", function (name) {
      api.rl.question("Message:>\n" , function (message) {
        api.writeJson(client, {
          "method": "message",
          "params": {
            "from": client.profile.name,
            "to": name,
            "message": message
          }
        })

        setTimeout(function () { chatSession() }, 1)
      })
    })

  }

  chatSession()
}

client.on('data', function(data) {
  value = api.readJson(client, data)

  if (value) {
    api.handleRequest(client, value)
  }
})

client.on('end', function() {
  console.log('disconnected from server')
})

/*
rl.setPrompt(">")
rl.prompt(true)

rl.on('line', function (cmd) {
  writeJson(client, {
    "method": "message"
  , "params": {
      "to": "alice"
    , "message": cmd
    }
  })
});
*/
