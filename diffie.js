var BigNumber = require('./bignumber')
var crypto = require('./crypto')

module.exports = m = {}

var two = new BigNumber(2)
  , one = new BigNumber(1)

m.getPrime = function (prime) {
  return prime.times(two).plus(one)
}

m.checkPrimitiveRoot = function (x, k, p) {

  /*
  for (var i=1; i<=k; i++) {
    ti = new BigNumber(i.toString())
    if (crypto.modPow(x, ti, p).eq(one)) {
      return false
    }
  }
  */

  return !crypto.modPow(x, one, p).eq(one) &&
         !crypto.modPow(x, two, p).eq(one) &&
         !crypto.modPow(x, k, p).eq(one)

  return true
}

m.getGenerator = function (k, p) {
  var roots = []
    , ti

  for (i = 1; i<p; i++) {
    ti = new BigNumber(i.toString())
    if (m.checkPrimitiveRoot(ti, k, p)) {
      roots.push(ti)
    }
  }

  return roots
}

m.rc4 = function (key, str) {
  var s = [], j = 0, x, res = '';
  for (var i = 0; i < 256; i++) {
    s[i] = i;
  }

  for (i = 0; i < 256; i++) {
    j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
    x = s[i];
    s[i] = s[j];
    s[j] = x;
  }

  i = 0;
  j = 0;
  for (var y = 0; y < str.length; y++) {
    i = (i + 1) % 256;
    j = (j + s[i]) % 256;
    x = s[i];
    s[i] = s[j];
    s[j] = x;
    res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
  }

  return res;
}

m.findSmallestRoot = function (arr) {
  var i, g, j, skip

  for (j=0; j<arr.length; j++) {
    g = arr[j]
    skip = false

    for (i=1; i<p; i++) {
      if (Math.pow(g, i) % p == 0) {
        skip = true
        break
      }
    }

    if (!skip)
      return g
  }

  return null
}

/*
roots = g.filter(function (g) {
  console.log("Testing g: ", g)
  for (var i=1; i<p; i++) {
    console.log(Math.pow(g, i) % p)
    if (Math.pow(g, i) % p == 0)
      return false
  }
  return true
})

console.log(roots[0])

k = crypto.setRandomNumber(16, 5)
p = m.getPrime(k)
g = m.getGenerator(k, p)[0]

console.log(p, g)

//console.log(m.findSmallestRoot(g))

rand = new BigNumber(1000)
rand2 = new BigNumber(1001)

a = g.pow(rand).mod(p)
b = a.pow(rand2).mod(p)

convert = m.rc4(b.toString(16), "allo")
converted = m.rc4(b.toString(16), convert)

console.log(converted)


BigNumber = require('./bignumber')
key = "de9b707d4c5a4633c0290c95ff30a605aeb7ae864ff48370f13cf01d49adb9f23d19a439f753ee7703cf342d87f431105c843c78ca4df639931f3458fae8a94d1687e99a76ed99d0ba87189f42fd31ad8262c54a8cf5914ae6c28c540d714a5f6087a171fb74f4814c6f968d72386ef356a05180c3bec7ddd5ef6fe76b0531c3"
*/

m.hexToBig = function (str) {
  length = str.length
  var start = new BigNumber(0)
    , two = new BigNumber(2)
    , one = new BigNumber(1)
    , four = new BigNumber(16)

  for(var i=0; i<str.length; i++) {
    num = parseInt(str[i], 16)
    index = length - i
    shift = one
    if (index > 1) {
      exp = new BigNumber(length - i - 1)
      shift = four.pow(exp)
    }
    start = start.plus(shift.times(num))
  }

  return start
}
