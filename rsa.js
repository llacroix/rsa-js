var BigNumber = require("./bignumber")
  , crypto = require("./crypto")
  
//BigNumber.MAX_POWER = Number.MAX_VALUE - 1

function randRange(min, max) {
  var delta = max - min
    , rand = Math.random() * delta

  return Math.floor(rand) + min
}

function Generate(bits) {
    //console.log("Generate P")
    this.P = crypto.setRandomNumber(randRange(bits-1, bits), 10);
    //console.log("Generate Q")
    this.Q = crypto.setRandomNumber(randRange(bits-1, bits), 10);

    this.N = this.P.times(this.Q);
    this.Fi = this.P.minus(BigNumber.ONE).times(this.Q.minus(BigNumber.ONE));

    length = Math.floor(this.N.toString(2).length / 3)

    //console.log(length)

    do
    {
        this.E = crypto.setRandomNumber(length, 10);
    }
    while (this.Fi.mod(this.E).eq(BigNumber.NULL) ||
           this.E.eq(this.P) ||
           this.E.eq(this.Q) ||
           this.E.gte(this.N));

    this.D = crypto.reverseNumber(this.E, this.Fi);
}

function NumberToString(text) {
  var str = []

  for (i=0; i<text.length; i++) {
    str += String.fromCharCode(text[i].toNumber())
  }

  return str
}

function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
}

function padSize(text, size) {
  var space = text.length % size
  return size - space
}

function convertNumberToBinary(number, size) {
  var asBinary = number.toString(2)
    , pad_size = padSize(asBinary, size)
    
    return padLeft(asBinary, size)
}

function StringToNumber(text) {
  var list = []

  for (i=0; i<text.length; i++) {
    list.push(new BigNumber(text.charCodeAt(i)))
  }

  return list
}

function splitString(text, size) {
  var parts = text.length / size
    , res = []
    , i = 0
  
  for (i=0; i<parts; i++) {
    res.push(text.substr(i*size, size))
  }

  return res
}

function encode(rsa, text) {
  var i=0
    , encodedString = []
    , binaryString = StringToNumber(text)

  for (i=0; i<text.length; i++) {
    charcode = binaryString[i]
    encodedChar = crypto.modPow(charcode, rsa.E, rsa.N)
    encodedString.push(encodedChar)
  }

  return encodedString
}

function decode(rsa, text) {
  var i=0
    , decodedString = []

  for (i=0; i<text.length; i++) {
    charcode = text[i]
    decodedChar = crypto.modPow(charcode, rsa.D, rsa.N)
    decodedString.push(decodedChar)
  }

  return decodedString
}

function BigNumberToString(encoded, charSize, maxSize) {
  var i = 0
    , res = []
    , str =  encoded.map(function (chars) {

    var asBinary = chars.toString(2)
      , fixed = padLeft(asBinary, maxSize)
      , splitted = splitString(fixed, charSize)
      , asChar = splitted.reduce(function (acc, val) {
                    var asInt = parseInt(val, 2)
                      , asChar = String.fromCharCode(asInt)

                    return acc + asChar
                 }, "")

    return asChar

  })

  str = str.join(String.fromCharCode(0))

  try {
    return btoa(str)
  } catch (exc) {
    return new Buffer(str).toString('base64')
  }

}

function binaryToNumber(text) {
  var length = text.length
    , num = new BigNumber(0)
    , i = 0

  for (i=0; i<text.length; i++) {
    if (text[i] == '1') {
      num = num.plus(BigNumber.TWO.pow(length-1-i))
    }
  }

  return num
}

function DecodeString(text, charSize) {
  var decoding = new Buffer(text, 'base64').toString()

  return decoding.split(String.fromCharCode(0))
         .map(function (character) {
            var bytes = character.split("")
                .map(function (c) {
                  return c.charCodeAt()
                })
                .map(function (n) {
                  return n.toString(2)
                })
                .map(function (b) {
                  return padLeft(b, charSize)
                })
                .join("")
            return bytes
         })
         .map(binaryToNumber)
}

/*
rsa = new Generate(64)

text = "1-2-3-4-5-6-7-8-9-10"

encoded = encode(rsa, text)

binaryEncoded = BigNumberToString(encoded, 8, 128)
binaryEncoded2 = BigNumberToString(encoded, 8, 128)


console.log(binaryEncoded)
binaryDecoded = DecodeString(binaryEncoded, 8)

decoded = decode(rsa, binaryDecoded)

console.log(NumberToString(decoded))

decoded = decode(rsa, encoded)
console.log(NumberToString(decoded))
*/

module.exports = {
  GenerateKeys: Generate
, encode: encode
, decode: decode
, convertNumberToBinary: convertNumberToBinary
, NumberToString: NumberToString
}
