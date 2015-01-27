var assert = require("assert")
  , crypto = require("../crypto")

describe('Big numbers', function(){
  it('Greatest common divisor', function(){
    assert.equal(crypto.RAE(32, 16).toNumber(), 16)
    assert.equal(crypto.RAE(16, 32).toNumber(), 16)
    assert.equal(crypto.RAE(1072, 462).toNumber(), 2)
    assert.equal(crypto.RAE(3, 5).toNumber(), 1)
    assert.equal(crypto.RAE(17, 31).toNumber(), 1)
  })

  it("Should be able to calculate modPow (x^y) % z", function () {
    assert.equal(crypto.modPow(3, 4, 100), 81)
    assert.equal(crypto.modPow(33, 5, 123), 114)
    assert.equal(crypto.modPow(1234, 234, 345), 121)

    assert.equal(crypto.modPow("1234567", "987654", "135678"), 7129)
    assert.equal(crypto.modPow("349857349587", "11000", "34324345"), 34135476)
    assert.equal(crypto.modPow("349857349587", "12000", "34324345"), 16370586)
  })

  it("Should be able to calculate reverse number (number1*x)mod(number2)=1",function () {
    assert.equal(crypto.reverseNumber(3, 11), 4)
    assert.equal(crypto.reverseNumber(17, 3120), 2753)
    assert.equal(crypto.reverseNumber("37234234", "218458345"), "88864059")
  })

  it("Should be able to calculate a big random number prime",function () {

    for (var i=2; i<100; i++) {
      random = crypto.getRandomNumber(i)
      assert.equal(random.toString(2).length, i)
      assert.equal(random.mod(2).toNumber(), 1)

      random = crypto.getRandomNumber(i)
      assert.equal(random.toString(2).length, i)
      assert.equal(random.mod(2).toNumber(), 1)

      random = crypto.getRandomNumber(i)
      assert.equal(random.toString(2).length, i)
      assert.equal(random.mod(2).toNumber(), 1)
    }

  })

  it("Should be able to calculate a big random number prime",function () {
      random = crypto.setRandomNumber(5, 4)
      assert.equal(random.toString(2).length, 5)
  })

  it("should be able to calculate a pollard number",function () {
      qp = crypto.pollard(8051)
      assert.equal(qp[0], 97)
      assert.equal(qp[1], 83)
  })
})
