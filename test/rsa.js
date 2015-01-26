var assert = require("assert")
  , crypto = require("../crypto")
  , rsa = require("../rsa")

describe('Can genrate a key', function(){
  it('convert binary number to number', function(){
    wallet = new rsa.GenerateKeys(32)

    assert.equal(wallet.E != null, true)
    assert.equal(wallet.D != null, true)
    assert.equal(wallet.E != null, true)
    assert.equal(wallet.Fi != null, true)
  })

  it('can decode and encode text', function () {
    wallet = new rsa.GenerateKeys(32)

    text = "1-2-3-4-5-6-7-8-9-10"

    encoded = rsa.encode(wallet, text)
    decoded = rsa.decode(wallet, encoded)

    textDecoded = rsa.NumberToString(decoded)

    assert.equal(text, textDecoded)
    assert.notEqual(encoded, decoded)
  })
})
