class Test {
  maxInt = (Arr) => {
    let max = Arr[0]
    for (let i = 1; i <= Arr.length; i++) {
      if (max < Arr[i]) {
        max = Arr[i]
      }
    }
    return max
  }
  Sort = (Arr) => {
    for (let i = 0; i < Arr.length - 1; i++) {
      for (let j = i + 1; j < Arr.length; j++) {
        if (Arr[i] > Arr[j]) {
          let a = Arr[i]
          Arr[i] = Arr[j]
          Arr[j] = a
        }
      }
    }
    return Arr
  }
  Sort2 = (Arr) => {
    return Arr.sort((a, b) => a - b)
  }
  Reverse = (str) => {
    const reverse = str.split('').reverse()
    return reverse.join('')
  }
  CheckNt = (number) => {
    if (number <= 3) {
      return true
    }
    for (let i = 2; i <= number / 2; i++) {
      if (number % i == 0) {
        return false
      }
    }
    return true
  }
  CheckDoiXung = (Arr) => {
    return Arr === Arr.split('').reverse().join('')
  }
  ConvertStr = (Str) => {
    const result = Str.replaceAll('i', 'l').split('')
    return result
  }
}

module.exports = new Test()
