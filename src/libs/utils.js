const utils = {
  IsInArray (arr, val) {
    var testStr = ',' + arr.join(',') + ','
    return testStr.indexOf(',' + val + ',') !== -1
  }
}
module.exports = {
  IsInArray: utils.IsInArray
}
