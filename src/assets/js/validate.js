export function isvalidPhone(str) {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    return reg.test(str)
  }
  export function isvalidname(str) {
    const reg = /^[\u4e00-\u9fa5 ]{2,20}$/
    return reg.test(str)
  }
  export function isvalidcard(str) {
    const reg = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/
    return reg.test(str)
  }