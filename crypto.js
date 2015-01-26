"use strict";

var BigNumber = require("./bignumber")

         // Генерировать параметры RSA
BigNumber.TWO = new BigNumber(2)
BigNumber.ONE = new BigNumber(1)
BigNumber.NULL = new BigNumber(0)
         
function RAE (number1, number2) {
  var number1 = new BigNumber(number1)
    , number2 = new BigNumber(number2)

    , tempNumber1 = new BigNumber(number1)
    , tempNumber2 = new BigNumber(number2)
    , tempNumber1Copy = null

    , bigNumbersZ = []
    , XNumber = null
    , XNumberTemp = null
    , YNumber = null
    , i

  if (tempNumber1.lt(tempNumber2)) {
    tempNumber1 = new BigNumber(number2)
    tempNumber2 = new BigNumber(number1)
  }

  while (!tempNumber1.mod(tempNumber2).equals(BigNumber.NULL)) {

    bigNumbersZ.push(tempNumber1.divToInt(tempNumber2))

    tempNumber1Copy = new BigNumber(tempNumber1)
    tempNumber1 = new BigNumber(tempNumber2)
    tempNumber2 = tempNumber1Copy.mod(tempNumber2)

  }

  XNumber = new BigNumber(BigNumber.NULL)
  YNumber = new BigNumber(BigNumber.ONE)

  for (i = bigNumbersZ.length - 1; i >= 0; i--) {

    XNumberTemp = new BigNumber(XNumber)
    XNumber = new BigNumber(YNumber)
    YNumber = XNumberTemp.minus(YNumber.times(bigNumbersZ[i]))

  }

  if (number1.gt(number2)) {

    if (YNumber.equals(BigNumber.ONE) && XNumber.equals(BigNumber.NULL))
      return number2;

    return XNumber.times(number1).plus(YNumber.times(number2))

  }
  else
  {
    if (YNumber.equals(BigNumber.ONE) && XNumber.equals(BigNumber.NULL))
      return number1;

    return YNumber.times(number1).plus(XNumber.times(number2))
  }
}

function modPow (number1, number2, number3) {
  // (number1^number2)mod(number3)
  var number1 = new BigNumber(number1)
    , number2 = new BigNumber(number2)
    , number3 = new BigNumber(number3)

    , tempNumber = new BigNumber(number1)
    , count = 0
    , size = number2.toString(2).length
    , test = false
    , shifted = null

  for (count = 0; count<size-1; count++) {
    shifted = number2.divToInt(BigNumber.TWO.pow(size-count-2))

    test = shifted.mod(BigNumber.TWO).eq(BigNumber.ONE)

    if (test) {
      tempNumber = tempNumber.times(tempNumber).times(number1).mod(number3);
    } else {
      tempNumber = tempNumber.times(tempNumber).mod(number3)
    }
  }

  return tempNumber
}

function xgcd(a, b) { 
  var temp = null
    , x = null
    , y = null
    , d = null

  if (b.eq(BigNumber.NULL)) {
    return [BigNumber.ONE, BigNumber.NULL, a];
  }

  temp = xgcd(b, a.mod(b));

  x = temp[0];
  y = temp[1];
  d = temp[2];

  return [y, x.minus(y.times(a.divToInt(b))), d];
}

function reverseNumber(a, b) {
  //(number1*x)mod(number2)=1
  var a = new BigNumber(a)
    , b = new BigNumber(b)

    , vals = xgcd(a, b)

  if (vals[0].lt(0)) {
    return vals[0].plus(b)
  }

  return vals[0]
}

function getRandomBit() {
  return Math.floor(Math.random(1) * 2)
}

function getRandom(min, max) {
  var delta = max - min
    , length = Math.floor(Math.random()*delta) + 1
    , number = new BigNumber(0)
    , i = null

  number = number.plus(BigNumber.TWO.pow(length-1))

  for (i = length-2; i > 0; i--) {
    if (getRandomBit()) {
      number = number.plus(BigNumber.TWO.pow(i))
    }
  }

  return number.plus(1)
}

function getRandomNumber(length) {
    // Odd number
    var number = new BigNumber(0)
      , i = null

    number = number.plus(BigNumber.TWO.pow(length-1))

    for (i = length-2; i > 0; i--) {
      if (getRandomBit()) {
        number = number.plus(BigNumber.TWO.pow(i))
      }
    }

    return number.plus(1)
}

function getBit(number, position) {

}

function findSD(number) {
  var s = new BigNumber(0)
    , d = number.minus(1)
    , quotient = null
    , remainder = null

  while (true) {
    quotient = d.divToInt(2)
    remainder = d.minus(quotient.times(2))

    if (remainder.eq(1))
      break;

    s = s.plus(1)
    d = quotient
  }

  return [s, d] 
}


function checkMillerRabin(n, k) {
  var sd = null
    , s = null
    , d = null
    , a = null
    , i = 0

  if (n.eq(2)) {
    return true
  }

  sd = findSD(n)

  s = sd[0]
  d = sd[1]

  function isComposite(a) {
    var j = 0

    if (modPow(a, d, n).eq(1)) {
      return false
    }

    for (j = 0; j<s; j++) {
      if (modPow(a, s.pow(j).times(d), n).eq(n.minus(1))) {
        return false
      }
    }

    return true
  }

  for (i=0; i<k; i++) {
    a = getRandom(2, n.toString(2).length)

    if (isComposite(a)) {
      return false
    }
  }

  return true
}

function getRandomPrime(length, iterations) {
  var composite = true
    , R = null

  while(composite) {
    R = getRandomNumber(length)
    composite = !checkMillerRabin(R, iterations)
  }

  return R
}

module.exports = {
  RAE: RAE
, modPow: modPow
, reverseNumber: reverseNumber
, setRandomNumber: getRandomPrime
, getRandomNumber: getRandomNumber
}
