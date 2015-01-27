var assert = require("assert")
  , crypto = require("../crypto")
  , rsa = require("../rsa")
  , decode = require("../decode")

describe('Can genrate a key', function(){
  this.timeout(2000000)

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

  it("can crack a coded data 16bit", function () {

    wallet = new rsa.GenerateKeys(16)

    encoded = crypto.modPow(196252, wallet.E, wallet.N)
    decoded = crypto.modPow(encoded, wallet.D, wallet.N)

    data = decode.crack(wallet.N, wallet.E, encoded)

    assert.equal(data, "Год")
  })

  it("can crack a coded data 32bit", function () {

    wallet = new rsa.GenerateKeys(32)

    encoded = crypto.modPow(196252, wallet.E, wallet.N)
    decoded = crypto.modPow(encoded, wallet.D, wallet.N)

    data = decode.crack(wallet.N, wallet.E, encoded)

    assert.equal(data, "Год")
  })
})
