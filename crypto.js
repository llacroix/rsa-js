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

function IsAPowerOfTwo(num, Twos) {
  var i = 0
    , num = new BigNumber(num)
    , num2 = null

  for (i=0; i<Twos.length; i++) {
    num2 = Twos[i]

    if (num.lt(num2)) {
      return false;
    } else if (num.eq(num2)) {
      Twos.splice(i)
      return true;
    }
  }

  return false;
}

/*
function pollard(number) {
  console.log("Pollard")

  var N = new BigNumber(number)
    , random = Math.random() * (Math.pow(2, 32) - 2)
    , Xi = new BigNumber(Math.floor(random) + 2)
    , Yi = BigNumber.ONE
    , two = new BigNumber(1)
    , NOD = null
    , T = null
    , Twos = []
    , divisorFound = false
    //флаг встречена новая степень двойки тру потому как 1 это степени двойки
    , NextIterationIsAPowerOfTwo = true
    , iteration = 2
    , xi_seen = []

  console.log("random", random)

  while (two.lt(N)) {
    console.log("Twos")
    Twos.push(two)
    two = two.times(2);
  }


  while (!divisorFound) {
    console.log("divisor", Xi.toNumber(), Yi.toNumber())

    if (NextIterationIsAPowerOfTwo) {
      console.log("Power of two")
      Yi = new BigNumber(Xi)
    }

    NextIterationIsAPowerOfTwo = IsAPowerOfTwo(iteration, Twos)

    Xi = (Xi.times(Xi).minus(BigNumber.ONE)).mod(N)
    T = Xi.gt(Yi) ? Xi.minus(Yi) : Yi.minus(Xi)
    xi_seen.push(Xi)

    console.log("T and N", T.toNumber(), N.toNumber())

    NOD = RAE(T, N);

    console.log("NOD: " , NOD.toNumber())

    //т.к. числа длины 1 это только ноль и единица, а 0 не может быть наименьшим общим делителем
    if (!NOD.eq(BigNumber.ONE)) {
      return [NOD, N.divToInt(NOD)]
    }

    if (inside(Xi, xi_seen)) {
      return [1, N]
    }

    iteration++;
  }

  return null;
}*/


function inside(value, list) {
  console.log("Checking value")

  var found = 0

  list.forEach(function (val) {
    if (val.eq(value)) {
      found++
    }
  })

  return found >= 2
}

function pollard(number) {
  function F(x) {
    return x.pow(2).plus(1).mod(number)
  }

  var number = new BigNumber(number)
    , MAX_PRECISION = 10000000000000000
    , INT_RAND = Math.floor(Math.random() * MAX_PRECISION).toString()
    , Xi = number.minus(2).divToInt(MAX_PRECISION).times(INT_RAND).plus(1)
    , Yi = new BigNumber(1)
    , i = new BigNumber(0)
    , NOD = new BigNumber(1)
    , stage = new BigNumber(2)

  while (NOD.eq(1)) {

    if (i.eq(stage)) {
      Yi = Xi
      stage = stage.times(BigNumber.TWO)
      console.log(NOD.toString(), Xi.toString(), Yi.toString(), stage.toString())
    }

    Xi = Xi.pow(BigNumber.TWO).plus(BigNumber.ONE).mod(number)
    i = i.plus(BigNumber.ONE)

    NOD = RAE(Xi.minus(Yi), number).abs()
  }

  console.log(NOD.toString(), Xi.toString(), Yi.toString(), stage.toString())

  return [NOD, number.divToInt(NOD)]
}

module.exports = {
  RAE: RAE
, modPow: modPow
, reverseNumber: reverseNumber
, setRandomNumber: getRandomPrime
, getRandomNumber: getRandomNumber
, pollard: pollard
, xgcd: xgcd
}
