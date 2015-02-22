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

  it("can crack a coded data 32bit 2", function () {

    wallet = new rsa.GenerateKeys(10)

    encoded = crypto.modPow(196252, wallet.E, wallet.N)
    decoded = crypto.modPow(encoded, wallet.D, wallet.N)

    console.log(wallet)

    data = decode.crack(wallet.N, wallet.E, encoded)

    assert.equal(data, "Год")
  })

  it("can crack correctly this", function () {
    wallet = {
      P: 421,
      Q: 263,
      N: 110723,
      Fi: 110040,
      E: 19,
      D: 69499
    }

    encoded = crypto.modPow(196252, wallet.E, wallet.N)
    decoded = crypto.modPow(encoded, wallet.D, wallet.N)

    console.log("Encoded", encoded)
    console.log("Decoded", decoded)

    console.log(wallet)

    data = decode.crack(wallet.N, wallet.E, encoded)

    assert.equal(data, "Год")

  })


  it("can crack big data 100bit", function () {
    //found = decode.crack("1309320295521959979486637519751", "710818076151030423063628477991", "1151643322579967235272288665179")
    //found = decode.crack("69736417863105965026610220973", "34275792357732740887562394731", "51083116293135572495621698283")
    //assert.equal(found, "allo")
  })
})
